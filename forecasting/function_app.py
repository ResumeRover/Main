import azure.functions as func
import logging
import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from datetime import datetime, timedelta
import warnings
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

warnings.filterwarnings('ignore')

class ARIMAForecastModel:
    """
    ARIMA model for forecasting job application volumes.
    """
    
    def __init__(self, mongo_uri=None, db_name=None, forecasting_collection=None, openings_collection=None):
        """
        Initialize the ARIMA forecast model with MongoDB connection.
        
        Args:
            mongo_uri (str): MongoDB connection URI
            db_name (str): MongoDB database name
            forecasting_collection (str): Forecasting collection name
            openings_collection (str): Job openings collection name
        """
        self.mongo_uri = mongo_uri or os.getenv("MONGO_URI")
        self.db_name = db_name or os.getenv("MONGO_DB_NAME")
        self.forecasting_collection = forecasting_collection or os.getenv("MONGO_COLLECTION")
        self.openings_collection = openings_collection or os.getenv("MONGO_OPENINGS_COLLECTION")
        
        if not all([self.mongo_uri, self.db_name, self.forecasting_collection]):
            raise ValueError("MongoDB connection settings must be set in .env or provided")
        
        self.client = None
        self.db = None
        self.forecast_coll = None
        self.openings_coll = None
        self.data = None
        self.models = {}
        self.forecasts = {}
        self.historical = {}
        self.job_roles = []
        self.accuracy_metrics = {}
        
        self.connect_to_mongodb()
    
    def connect_to_mongodb(self):
        """Establish connection to MongoDB."""
        try:
            self.client = MongoClient(self.mongo_uri)
            self.db = self.client[self.db_name]
            self.forecast_coll = self.db[self.forecasting_collection]
            self.openings_coll = self.db[self.openings_collection]
            logging.info(f"Connected to MongoDB: {self.db_name}.{self.forecasting_collection}, {self.openings_collection}")
        except Exception as e:
            logging.error(f"Error connecting to MongoDB: {e}")
            self.data = self._create_sample_data("Software Engineer")
    
    def load_data(self, job_role):
        """
        Load application data for a job role from MongoDB.
        
        Args:
            job_role (str): Job role to load data for
        
        Returns:
            tuple: (DataFrame or None, dict or None) - Historical data, job details
        """
        try:
            if self.forecast_coll is None or self.openings_coll is None:
                logging.info("MongoDB connection not available. Using sample data.")
                return self._create_sample_data(job_role), None
            
            # Fetch job opening details
            job_details = self.openings_coll.find_one({"title": job_role})
            if not job_details:
                logging.info(f"No job opening details found for {job_role} in {self.openings_coll}")
                return None, None
            
            # Fetch historical data
            documents = list(self.forecast_coll.find({"job_role": job_role}))
            if not documents:
                logging.info(f"No historical data found for {job_role}")
                return None, job_details
            
            data = pd.DataFrame(documents)
            if 'date' in data.columns:
                data['date'] = pd.to_datetime(data['date'])
            data = data.sort_values('date')
            self.job_roles = [job_role]
            logging.info(f"Loaded {len(data)} records for {job_role}")
            return data, job_details
        
        except Exception as e:
            logging.error(f"Error loading data for {job_role}: {e}")
            return self._create_sample_data(job_role), None
    
    def _create_sample_data(self, job_role):
        """Create sample data for a job role."""
        logging.info(f"Creating sample data for {job_role}...")
        dates = pd.date_range(start='2025-01-01', end='2025-05-09', freq='D')
        data_list = []
        base = 10 if job_role == 'Software Engineer' else 5 if job_role == 'Data Scientist' else 3
        for date in dates:
            trend = date.dayofyear / 30
            season = np.sin(date.dayofyear / 365 * 2 * np.pi) * 5
            noise = np.random.normal(0, 2)
            applications = max(0, int(base + trend + season + noise))
            data_list.append({
                'date': date,
                'job_role': job_role,
                'applicant_count': applications
            })
        return pd.DataFrame(data_list)
    
    def train_models(self, role, job_starting_date, job_closing_date):
        """
        Train ARIMA model for a job role.
        
        Args:
            role (str): Job role
            job_starting_date (datetime): Job opening date
            job_closing_date (datetime): Job closing date
        """
        self.models = {}
        self.forecasts = {}
        self.historical = {}
        
        role_data = self.data[self.data['job_role'] == role]
        
        if role_data.empty:
            return
        
        self.historical[role] = role_data.copy()
        role_data_indexed = role_data.set_index('date')
        ts = role_data_indexed['applicant_count']
        
        try:
            model = ARIMA(ts, order=(1, 1, 1))
            model_fit = model.fit()
            self.models[role] = model_fit
            
            last_date = max(role_data['date'].max(), job_starting_date)
            forecast_end = job_closing_date if job_closing_date else last_date + timedelta(days=30)
            forecast_steps = max(1, (forecast_end - last_date).days)
            
            forecast = model_fit.forecast(steps=forecast_steps)
            forecast_dates = pd.date_range(start=last_date + timedelta(days=1), periods=len(forecast))
            forecast_df = pd.DataFrame({
                'date': forecast_dates,
                'forecast': forecast.values
            })
            self.forecasts[role] = forecast_df
        except Exception as e:
            logging.error(f"Error creating model for {role}: {e}")
    
    def calculate_accuracy(self, role):
        """Calculate accuracy metrics for the model."""
        self.accuracy_metrics = {}
        role_data = self.historical.get(role, pd.DataFrame())
        
        if role_data.empty:
            self.accuracy_metrics[role] = {'mae': 0, 'mape': 0, 'accuracy': 0}
            return
        
        train_size = int(len(role_data) * 0.9)
        train_data = role_data.iloc[:train_size]
        test_data = role_data.iloc[train_size:]
        
        if len(test_data) > 0:
            train_ts = train_data.set_index('date')['applicant_count']
            try:
                test_model = ARIMA(train_ts, order=(1, 1, 1))
                test_model_fit = test_model.fit()
                test_forecast = test_model_fit.forecast(steps=len(test_data))
                
                actual = test_data['applicant_count'].values
                predicted = test_forecast.values
                mae = np.mean(np.abs(actual - predicted))
                mape = np.mean(np.abs((actual - predicted) / np.maximum(1, actual))) * 100
                
                self.accuracy_metrics[role] = {
                    'mae': round(mae, 2),
                    'mape': round(mape, 2),
                    'accuracy': round(100 - min(mape, 100), 2)
                }
            except Exception as e:
                logging.error(f"Error calculating accuracy for {role}: {e}")
                self.accuracy_metrics[role] = {'mae': 0, 'mape': 0, 'accuracy': 0}
        else:
            self.accuracy_metrics[role] = {'mae': 0, 'mape': 0, 'accuracy': 0}
    
    def prepare_dashboard_data(self, job_role, data, job_details):
        """
        Prepare data for the dashboard.
        
        Args:
            job_role (str): Job role
            data (DataFrame): Historical data
            job_details (dict): Job opening details
        
        Returns:
            dict: Dashboard data or error message
        """
        if data is None or job_details is None:
            return {
                'status': 'error',
                'message': 'No past records available to forecast'
            }
        
        job_opening_date = pd.to_datetime(job_details.get('created_at')) if job_details.get('created_at') else None
        job_closing_date = pd.to_datetime(job_details.get('closing_at')) if job_details.get('closing_at') else None
        
        self.data = data
        self.train_models(job_role, job_opening_date, job_closing_date)
        self.calculate_accuracy(job_role)
        
        forecast_chart_data = []
        hist_data = self.historical.get(job_role, pd.DataFrame())
        if not hist_data.empty:
            for _, row in hist_data.iterrows():
                forecast_chart_data.append({
                    'date': row['date'].strftime('%Y-%m-%d'),
                    'value': row['applicant_count'],
                    'type': 'Historical',
                    'job_role': job_role
                })
        
        if job_role in self.forecasts:
            forecast_data = self.forecasts[job_role]
            for _, row in forecast_data.iterrows():
                forecast_chart_data.append({
                    'date': row['date'].strftime('%Y-%m-%d'),
                    'value': max(0, row['forecast']),
                    'type': 'Forecast',
                    'job_role': job_role
                })
        
        return {
            'status': 'success',
            'forecast_chart_data': forecast_chart_data,
            'job_role': job_role,
            'job_opening_date': job_opening_date.strftime('%Y-%m-%d'),
            'job_closing_date': job_closing_date.strftime('%Y-%m-%d') if job_closing_date else None
        }

# Initialize model
model = ARIMAForecastModel()

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="forecast")
def forecast(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        # Get job_role from query parameters
        job_role = req.params.get('job_role')
        
        # If not in query params, try to get from request body
        if not job_role:
            try:
                req_body = req.get_json()
                job_role = req_body.get('job_role')
            except ValueError:
                pass

        if not job_role:
            return func.HttpResponse(
                "Please provide a job_role parameter in the query string or request body.",
                status_code=400
            )

        # Get forecast data
        data, job_details = model.load_data(job_role)
        dashboard_data = model.prepare_dashboard_data(job_role, data, job_details)
        
        return func.HttpResponse(
            json.dumps(dashboard_data),
            mimetype="application/json",
            status_code=200
        )

    except Exception as e:
        logging.error(f"Error processing request: {str(e)}")
        return func.HttpResponse(
            json.dumps({"status": "error", "message": str(e)}),
            mimetype="application/json",
            status_code=500
        )