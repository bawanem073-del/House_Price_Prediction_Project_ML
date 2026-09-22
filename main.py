
import pandas as pd
import numpy as np
import joblib
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware


model = joblib.load('artifacts/House_price_predictor_model.pkl')


app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HouseData(BaseModel):

    Rooms           : int = Field(..., ge = 0, le = 20)
    Bathroom        : int = Field(..., ge = 0, le = 10)
    Car             : int = Field(..., ge = 0, le = 5)
    Distance        : float = Field(..., ge = 0)
    BuildingArea    : float = Field(..., ge = 0)
    Landsize        : float = Field(..., ge = 0)
    Age             : float = Field(..., ge = 0)
    Type            : Literal["h", "t", "u"] 
    Grouped_Suburb  :Literal['Other', 'Reservoir','Richmond','Bentleigh East','Preston','Brunswick','Essendon','South Yarra','Glen Iris','Hawthorn']
    Grouped_SellerG : Literal['Other','Nelson','Jellis','hockingstuart','Barry', 'Ray','Marshall','Buxton','Biggin','Brad']



top_SellerG = ['Other',
                'Nelson',
                'Jellis',
                'hockingstuart',
                'Barry',
                'Ray',
                'Marshall',
                'Buxton',
                'Biggin',
                'Brad']

top_Suburb = ['Other',
                'Reservoir',
                'Richmond',
                'Bentleigh East',
                'Preston',
                'Brunswick',
                'Essendon',
                'South Yarra',
                'Glen Iris',
                'Hawthorn']


class PredictionResponse(BaseModel):
    predicted_price: float





@app.post("/predict")
def predict(data: HouseData):
    Suburb_group = data.Grouped_Suburb if data.Grouped_Suburb in top_Suburb else 'Other'
    SellerG_group = data.Grouped_SellerG if data.Grouped_SellerG in top_SellerG else 'Other'


    input_row = pd.DataFrame([{
        'Rooms'            : data.Rooms,
        'Bathroom'         : data.Bathroom,
        'Car'              : data.Car,
        'Distance'         : data.Distance,
        'BuildingArea'     : data.BuildingArea,
        'Landsize'         : data.Landsize,
        'Age'              : data.Age,
        'Type'             : data.Type,
        'Grouped_Suburb'   : Suburb_group,
        'Grouped_SellerG'  : SellerG_group
      
    }])

    prediction = model.predict(input_row)
    actual_price = np.expm1(prediction[0])

    return PredictionResponse(predicted_price=actual_price)


@app.get("/")
def read_root():
    return {"message": "Welcome to the House Price Prediction API"}

