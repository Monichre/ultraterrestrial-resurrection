#!/usr/bin/env python3
"""
Export data from current Xata production instance
Step 1 of Xata → PostgreSQL Wire Migration

Date: July 8, 2025
"""

import os
import subprocess
import sys
from pathlib import Path
from datetime import datetime

class XataExporter:
    def __init__(self):
        # Source (Current Production)
        self.source_workspace = "UltraTerrestrial-kgubvq"
        self.source_database = "ultraterrestrial" 
        self.source_branch = "main"
        self.source_region = "us-east-1"
        self.source_api_key = os.getenv('XATA_API_KEY', 'xau_LKJxzxjzXasEUXxjmhCBACdTCvi5Ed2v1')
        
        # Paths
        self.project_root = Path(__file__).parent
        self.exports_dir = self.project_root / "xata-exports"
        self.xreplay_script = self.project_root / "apps/app/scripts/xata-exports/xata_tools/xreplay.py"
        
        print(f"📤 Xata Production Data Export")
        print(f"📅 {datetime.now().isoformat()}")
        print(f"Source: {self.source_workspace}/{self.source_database}")
        print(f"Export to: {self.exports_dir}")
        print()

    def run_export(self):
        """Export all data from current production instance using xreplay.py"""
        print("📤 Exporting data from current production instance...")
        
        # Ensure exports directory exists
        self.exports_dir.mkdir(exist_ok=True)
        
        # Build xreplay command
        cmd = [
            "python3", str(self.xreplay_script),
            "--from_workspace", self.source_workspace,
            "--from_database", self.source_database,
            "--from_branch", self.source_branch,
            "--from_region", self.source_region,
            "--from_XATA_API_KEY", self.source_api_key,
            "--output", "file",
            "--output_path", str(self.exports_dir),
            "--output_format", "csv"
        ]
        
        print(f"Running: {' '.join(cmd[:6])} ... [API key hidden]")
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            print("✅ Export completed successfully!")
            if result.stdout:
                print(f"Output: {result.stdout}")
                
            # List exported files
            if self.exports_dir.exists():
                csv_files = list(self.exports_dir.glob("*.csv"))
                print(f"\n📊 Exported {len(csv_files)} CSV files:")
                for csv_file in sorted(csv_files):
                    file_size = csv_file.stat().st_size
                    print(f"  - {csv_file.name} ({file_size:,} bytes)")
                    
        except subprocess.CalledProcessError as e:
            print(f"❌ Export failed: {e}")
            print(f"Error output: {e.stderr}")
            raise
        except FileNotFoundError:
            print(f"❌ Could not find xreplay script at: {self.xreplay_script}")
            print("Please ensure the script exists or update the path")
            raise

def main():
    """Main export function"""
    exporter = XataExporter()
    exporter.run_export()
    
    print("\n🎉 Export completed!")
    print("Next step: Run PostgreSQL import script with the exported data")

if __name__ == "__main__":
    main()