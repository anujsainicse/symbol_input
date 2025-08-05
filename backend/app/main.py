from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import dex, cex, futures, files

app = FastAPI(
    title="Crypto Symbols Manager API",
    description="File-based cryptocurrency symbols management system",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3003"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(dex.router)
app.include_router(cex.router)
app.include_router(futures.router)
app.include_router(files.router)

@app.get("/")
async def root():
    return {"message": "Crypto Symbols Manager API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}