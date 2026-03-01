from fastapi import FastAPI, Depends
from fastapi.security import HTTPBearer
from app.db.database import engine, Base
from app.db import models
from app.api import auth_routes
from app.core.rbac import require_role
from app.core.audit import log_action
from app.api.routes import account_routes
from app.api.routes import transaction_routes
from app.api.routes import analytics_routes
from app.api.routes import admin_routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(account_routes.router, prefix="/account", tags=["Account"])
app.include_router(transaction_routes.router, prefix="/transaction", tags=["Transaction"])
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

app.include_router(analytics_routes.router)
app.include_router(admin_routes.router)