import boto3
import os

DYNAMODB_ENDPOINT = os.getenv("DYNAMODB_ENDPOINT", "http://localhost:8000")
AWS_REGION = os.getenv("AWS_DEFAULT_REGION", "us-east-1")

def get_dynamodb():
    return boto3.resource(
        "dynamodb",
        region_name=AWS_REGION,
        endpoint_url=DYNAMODB_ENDPOINT,
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID", "local"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY", "local"),
    )

def get_table():
    db = get_dynamodb()
    return db.Table("Incidentes")

def create_table_if_not_exists():
    db = get_dynamodb()
    existing = [t.name for t in db.tables.all()]

    if "Incidentes" in existing:
        print("✅ Tabla 'Incidentes' ya existe.")
        return

    db.create_table(
        TableName="Incidentes",
        KeySchema=[
            {"AttributeName": "CiudadZona", "KeyType": "HASH"},
            {"AttributeName": "FechaID",    "KeyType": "RANGE"},
        ],
        AttributeDefinitions=[
            {"AttributeName": "CiudadZona", "AttributeType": "S"},
            {"AttributeName": "FechaID",    "AttributeType": "S"},
            {"AttributeName": "categoria",  "AttributeType": "S"},
            {"AttributeName": "estado",     "AttributeType": "S"},
        ],
        GlobalSecondaryIndexes=[
            {
                "IndexName": "GSI-categoria",
                "KeySchema": [{"AttributeName": "categoria", "KeyType": "HASH"}],
                "Projection": {"ProjectionType": "ALL"},
                "OnDemandThroughput": {"MaxReadRequestUnits": 40, "MaxWriteRequestUnits": 40},
            },
            {
                "IndexName": "GSI-estado",
                "KeySchema": [{"AttributeName": "estado", "KeyType": "HASH"}],
                "Projection": {"ProjectionType": "ALL"},
                "OnDemandThroughput": {"MaxReadRequestUnits": 40, "MaxWriteRequestUnits": 40},
            },
        ],
        BillingMode="PAY_PER_REQUEST",
    )
    print("✅ Tabla 'Incidentes' creada correctamente.")