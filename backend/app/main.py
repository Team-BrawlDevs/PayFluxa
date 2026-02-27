from fastapi import FastAPI, Depends
from fastapi.security import HTTPBearer
from app.db.database import engine, Base
from app.db import models
from app.api import auth_routes
from app.core.rbac import require_role
from app.core.audit import log_action
app = FastAPI()

# Security scheme for Swagger
security = HTTPBearer()

# Create tables
Base.metadata.create_all(bind=engine)

app.include_router(auth_routes.router, prefix="/auth")

@app.get("/")
def root():
    return {"message": "PayFluxa Backend Running"}



@app.get("/protected/customer", dependencies=[Depends(security)])
def protected_customer(user=Depends(require_role("customer"))):

    print("USER FROM TOKEN:", user)

    log_action(
        user_id=user["user_id"],
        role=user["role"],
        action="ACCESS_PROTECTED_ROUTE",
        entity="customer_endpoint",
        details="Customer accessed protected route"
    )

    print("LOG FUNCTION CALLED")

    return {"message": "Customer access granted"}