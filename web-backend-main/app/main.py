import os
import joblib
import logging
import numpy as np
from typing import List, Optional, Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Assuming schemas.py and preprocess.py are in the same directory as main.py (e.g., backend/app/)
# or accessible in PYTHONPATH
from schemas import Passenger # Your existing Passenger schema
from preprocess import preprocess

app = FastAPI(title="Titanic Survival Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Determine the base directory of the current script (main.py)
# Assuming main.py is in .../SOFTWARE_ENGINEERING/backend/app/
BASE_DIR_MAIN_PY = os.path.dirname(os.path.abspath(__file__))

# Construct the path to the models directory based on your project structure
# Go up two levels from backend/app/ to SOFTWARE_ENGINEERING/
# Then into train_models/models/
MODELS_DIR = os.path.abspath(os.path.join(BASE_DIR_MAIN_PY, "..", "..", "model-backend", "models"))


# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    logger.info(f"Attempting to load models from directory: {MODELS_DIR}")
    if not os.path.isdir(MODELS_DIR):
        logger.error(f"Models directory not found: {MODELS_DIR}")
        raise FileNotFoundError(f"Models directory not found: {MODELS_DIR}")

    models = {
        "logistic_regression": joblib.load(os.path.join(MODELS_DIR, "logistic_regression_model.pkl")),
        "svm": joblib.load(os.path.join(MODELS_DIR, "svm_model.pkl")),
        "knn": joblib.load(os.path.join(MODELS_DIR, "knn_model.pkl")),
        "random_forest": joblib.load(os.path.join(MODELS_DIR, "random_forest_model.pkl")),
        "decision_tree": joblib.load(os.path.join(MODELS_DIR, "decision_tree_model.pkl")),
    }
    logger.info(f"All models loaded successfully from {MODELS_DIR}.")
except FileNotFoundError as e:
    logger.error(f"Error loading models: {e}. Searched in '{MODELS_DIR}'. Please ensure this path is correct and contains all required .pkl files (e.g., logistic_regression_model.pkl).")
    # Optionally, list files in MODELS_DIR if it exists, to help debug
    if os.path.isdir(MODELS_DIR): # This check might be redundant if FileNotFoundError was for the directory itself
        logger.info(f"Files found in {MODELS_DIR}: {os.listdir(MODELS_DIR)}")
    else:
        logger.warning(f"The directory {MODELS_DIR} does not exist or is not accessible.")
    raise # Re-raise the exception to stop the application if models can't be loaded
except Exception as e:
    logger.error(f"An unexpected error occurred during model loading: {e}", exc_info=True)
    raise

# --- Pydantic Models ---
class ModelResponse(BaseModel):
    model_name: str
    survival_probability: float

class PredictionRequestBody(BaseModel):
    passenger: Passenger
    model_names: Optional[List[str]] = None

# --- API Endpoints ---
@app.get("/status", summary="Check API status")
async def status():
    return {"status": "ok", "message": "API is running."}

@app.get("/logs", summary="Get dummy application logs")
async def get_logs():
    loaded_model_names = list(models.keys())
    logs_messages = [f"Log: Model '{model_name}' loaded." for model_name in loaded_model_names]
    logs_messages.append("Log: API initialized.")
    return {"logs": logs_messages}

@app.post("/predict", response_model=List[ModelResponse], summary="Predict passenger survival")
async def predict(payload: PredictionRequestBody):
    logger.info("--- /predict endpoint hit ---")
    logger.info(f"Received passenger data: {payload.passenger.dict()}")
    logger.info(f"Received model names: {payload.model_names}")

    passenger_data = payload.passenger
    model_names_to_use = payload.model_names

    if model_names_to_use is None or not model_names_to_use:
        model_names_to_use = list(models.keys())
        logger.info(f"No specific models requested, using all available models: {model_names_to_use}")
    else:
        actual_models_to_use = [name for name in model_names_to_use if name in models]
        if not actual_models_to_use:
            logger.warning(f"None of the requested models were found: {model_names_to_use}. Available: {list(models.keys())}")
            raise HTTPException(
                status_code=404,
                detail=f"None of the requested models ({', '.join(model_names_to_use)}) were found. Available models: {', '.join(models.keys())}"
            )
        model_names_to_use = actual_models_to_use
        logger.info(f"Using specified models: {model_names_to_use}")

    predictions = []
    try:
        processed_data = preprocess(passenger_data)
        logger.info("Passenger data preprocessed successfully.")
    except Exception as e:
        logger.error(f"Error during preprocessing: {e}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Error in preprocessing passenger data: {str(e)}")

    for model_name in model_names_to_use:
        model = models[model_name]
        try:
            if not hasattr(model, 'predict_proba'):
                logger.error(f"Model {model_name} does not have a 'predict_proba' method.")
                raise HTTPException(status_code=500, detail=f"Model {model_name} cannot provide probability (no predict_proba method).")

            raw_probabilities = model.predict_proba(processed_data)
            survival_probability = raw_probabilities[0, 1]

            predictions.append(
                ModelResponse(model_name=model_name, survival_probability=float(survival_probability))
            )
            logger.info(f"Prediction successful for model {model_name}: Probability {survival_probability:.4f}")
        except IndexError as e:
            logger.error(f"Error accessing probability for model {model_name}. predict_proba output: {raw_probabilities}. Error: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Could not extract survival probability for model {model_name}.")
        except Exception as e:
            logger.error(f"Error during prediction with model {model_name}: {str(e)}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Error during prediction with model {model_name}: {str(e)}")

    logger.info(f"Returning {len(predictions)} predictions.")
    return predictions

if __name__ == "__main__":
    import uvicorn
    logger.info(f"Starting Uvicorn server from main.py. Models expected at: {MODELS_DIR}")
    uvicorn.run(app, host="0.0.0.0", port=8000)