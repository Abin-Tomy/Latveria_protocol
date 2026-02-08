import os
import sys
import subprocess
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

def run_command(command, cwd=None):
    try:
        subprocess.check_call(command, shell=True, cwd=cwd)
        print(f"✅ Successfully ran: {command}")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to run: {command}")
        sys.exit(1)

def main():
    print("🚀 Preparing for Vercel Deployment...")
    
    backend_dir = BASE_DIR / "backend"
    
    # Check if virtual env is active (optional/advisory)
    if sys.prefix == sys.base_prefix:
        print("⚠️  Warning: It seems you're not in a virtual environment.")
        print("   Make sure backend dependencies are installed globally or activate your venv.")
    
    print("\n📦 Collecting static files...")
    # Only run collectstatic if manage.py exists
    if (backend_dir / "manage.py").exists():
        run_command("python manage.py collectstatic --noinput", cwd=backend_dir)
    else:
        print(f"❌ Could not find manage.py in {backend_dir}")
        sys.exit(1)
        
    print("\n📝 Checking .gitignore...")
    gitignore_path = backend_dir / ".gitignore"
    if gitignore_path.exists():
        with open(gitignore_path, "r") as f:
            content = f.read()
        if "staticfiles/" in content:
            print("❌ 'staticfiles/' is still in .gitignore. Please remove it manually.")
        else:
            print("✅ .gitignore looks good (staticfiles not ignored).")
            
    print("\n✅ Preparation Complete!")
    print("👉 Next Steps:")
    print("1.  Commit the changes, INCLUDING the new 'backend/staticfiles' folder.")
    print("2.  Push to GitHub.")
    print("3.  Import project in Vercel.")
    print("4.  Configure Environment Variables (DATABASE_URL, etc.).")
    print("5.  Deploy!")

if __name__ == "__main__":
    main()
