# Setup script for Mentor AI Universe (PowerShell)
# This script will help you set up the project quickly

Write-Host "🚀 Setting up Mentor AI Universe..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js v18 or higher." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
Write-Host ""

# Check if backend/.env exists
if (-Not (Test-Path "backend\.env")) {
    Write-Host "⚠️  backend\.env not found" -ForegroundColor Yellow
    Write-Host "📝 Creating backend\.env from backend\.env.example..." -ForegroundColor Yellow
    
    if (Test-Path "backend\.env.example") {
        Copy-Item "backend\.env.example" "backend\.env"
        Write-Host "✅ Created backend\.env" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  IMPORTANT: Please edit backend\.env and add your actual credentials:" -ForegroundColor Yellow
        Write-Host "   - SUPABASE_URL" -ForegroundColor White
        Write-Host "   - SUPABASE_ANON_KEY" -ForegroundColor White
        Write-Host "   - SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor White
        Write-Host "   - NVIDIA_API_KEY (optional)" -ForegroundColor White
        Write-Host "   - OPENAI_API_KEY (optional)" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "❌ backend\.env.example not found" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ backend\.env already exists" -ForegroundColor Green
    Write-Host ""
}

Write-Host "✨ Setup complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit backend\.env with your actual credentials" -ForegroundColor White
Write-Host "2. Run 'npm run dev:all' to start the development server" -ForegroundColor White
Write-Host ""
Write-Host "For more information, see SETUP_GUIDE.md" -ForegroundColor Cyan

