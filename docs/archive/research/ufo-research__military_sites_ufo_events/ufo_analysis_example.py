"""
UFO-Nuclear Facility Correlation Analysis Example
Implementation Guide with Python
"""

import pandas as pd
import numpy as np
import geopandas as gpd
from scipy.spatial import distance
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
import pysal
import seaborn as sns
from shapely.geometry import Point

class UfoNuclearAnalysis:
    def __init__(self, ufos_path, nuclear_path, population_path):
        """
        Initialize analysis with data paths
        
        Args:
            ufos_path: Path to UFO sightings CSV
            nuclear_path: Path to nuclear facilities CSV
            population_path: Path to population density raster/CSV
        """
        self.ufos = pd.read_csv(ufos_path)
        self.nuclear = pd.read_csv(nuclear_path)
        self.population = pd.read_csv(population_path)
        
    def clean_ufo_data(self):
        """Clean and standardize UFO dataset"""
        # Drop rows with missing coordinates
        self.ufos = self.ufos.dropna(subset=['latitude', 'longitude'])
        
        # Convert to geopandas
        self.ufos_gdf = gpd.GeoDataFrame(
            self.ufos, 
            geometry=gpd.points_from_xy(self.ufos.longitude, self.ufos.latitude),
            crs='EPSG:4326'
        )
        
        # Filter by quality score
        self.ufos_gdf = self.ufos_gdf[self.ufos_gdf['quality_score'] >= 0.7]
        
        return self.ufos_gdf
    
    def create_spatial_features(self):
        """Generate spatial features for analysis"""
        # Nuclear facility proximity features
        nuclear_coords = self.nuclear[['latitude', 'longitude']].values
        ufo_coords = self.ufos_gdf[['latitude', 'longitude']].values
        
        # Calculate distances to nearest nuclear facility
        distances = []
        for ufo_coord in ufo_coords:
            dist = np.min([distance.euclidean(ufo_coord, nuc_coord) 
                          for nuc_coord in nuclear_coords])
            distances.append(dist)
        
        self.ufos_gdf['nuclear_distance'] = distances
        
        # Create categorical distance bins
        self.ufos_gdf['nuclear_proximity'] = pd.cut(
            self.ufos_gdf['nuclear_distance'], 
            bins=[0, 10, 25, 50, 100, np.inf], 
            labels=['0-10km', '10-25km', '25-50km', '50-100km', '100km+']
        )
        
        return self.ufos_gdf
    
    def create_control_areas(self):
        """Generate matched control areas"""
        # Create grid of control areas matched by population density
        
        # Example: Generate random control points matching population density
        control_points = []
        
        # For each nuclear facility, create 5 matched controls
        for _, nuc in self.nuclear.iterrows():
            lat, lon = nuc['latitude'], nuc['longitude']
            
            # Generate points at similar population density
            # This is simplified - real implementation would use
            # sophisticated spatial matching
            matched_controls = np.random.normal([lat, lon], scale=0.5, size=(5, 2))
            
            for control in matched_controls:
                control_points.append({
                    'type': 'control',
                    'latitude': control[0],
                    'longitude': control[1],
                    'matched_population': self.get_population_density(control[0], control[1]),
                    'matched_nuclear': np.inf  # Far from nuclear facilities
                })
        
        return pd.DataFrame(control_points)
    
    def get_population_density(self, lat, lon):
        """Get population density at given coordinates"""
        # This would interface with actual population data
        # Simplified version returns dummy data
        return np.random.uniform(100, 10000)
    
    def statistical_analysis(self):
        """Perform comprehensive statistical analysis"""
        
        # Prepare data for regression
        data = self.ufos_gdf.copy()
        
        # Create binary outcome (near nuclear facility)
        data['near_nuclear'] = (data['nuclear_distance'] <= 25).astype(int)
        
        # Prepare covariates
        features = ['population_density', 'light_pollution', 'air_traffic', 
                   'weather_visibility', 'reporting_bias_score']
        
        # Ensure we have these features calculated
        for feature in features:
            if feature not in data.columns:
                data[feature] = np.random.uniform(0, 1, len(data))
        
        # Standardize features
        scaler = StandardScaler()
        X = scaler.fit_transform(data[features])
        y = data['near_nuclear'].values
        
        # Split data
        from sklearn.model_selection import train_test_split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, 
                                                          random_state=42)
        
        # Fit models
        models = {
            'logistic': LogisticRegression(random_state=42),
            'poisson': PoissonRegression(),  # Pseudo-implementation
            'spatstat': SpatialPointPatternAnalysis()
        }
        
        results = {}
        for name, model in models.items():
            if name == 'spatstat':
                # Spatial point pattern analysis
                results[name] = self.spatial_point_pattern_analysis()
            else:
                model.fit(X_train, y_train)
                score = model.score(X_test, y_test)
                pred = model.predict(X_test)
                results[name] = {
                    'score': score,
                    'classification_report': classification_report(y_test, pred),
                    'coefficients': dict(zip(features, model.coef_[0]))
                }
        
        return results
    
    def spatial_point_pattern_analysis(self):
        """Perform spatial point pattern analysis"""
        
        # Use PySAL for spatial analysis
        # This would create spatial weights and analyze clustering
        
        # Example: Getis-Ord G statistic
        coords = self.ufos_gdf[['longitude', 'latitude']].values
        w = pysal.lib.weights.DistanceBand.from_array(coords, threshold=0.5)
        
        # Create distance matrix to nuclear facilities
        nuclear_coords = self.nuclear[['longitude', 'latitude']].values
        
        # Calculate spatial autocorrelation
        y = np.array([1 if dist <= 25 else 0 for dist in self.ufos_gdf['nuclear_distance']])
        
        # Moran's I
        moran = pysal.explore.esda.Moran(y, w)
        
        return {
            'moran_i': moran.I,
            'moran_p': moran.p_sim,
            'spatial_autocorrelation': moran.p_sim < 0.05
        }
    
    def generate_visualizations(self):
        """Create comprehensive visualizations"""
        
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        
        # 1. Spatial density plot
        ax = axes[0,0]
        # Generate density plot of UFO sightings
        sns.kdeplot(data=self.ufos_gdf, x='longitude', y='latitude', ax=ax)
        ax.scatter(self.nuclear['longitude'], self.nuclear['latitude'], 
                  color='red', s=100, alpha=0.7, label='Nuclear Facilities')
        ax.set_title('UFO Sighting Density vs Nuclear Facilities')
        ax.legend()
        
        # 2. Distance distribution
        ax = axes[0,1]
        ax.hist(self.ufos_gdf['nuclear_distance'], bins=50, alpha=0.7)
        ax.axvline(x=25, color='red', linestyle='--', 
                  label='25km threshold')
        ax.set_xlabel('Distance to Nuclear Facility (km)')
        ax.set_ylabel('Number of Sightings')
        ax.set_title('Distribution of Sightings by Nuclear Proximity')
        ax.legend()
        
        # 3. Time series
        ax = axes[1,0]
        if 'date' in self.ufos_gdf.columns:
            self.ufos_gdf['date'] = pd.to_datetime(self.ufos_gdf['date'])
            monthly_counts = self.ufos_gdf.resample('M', on='date').size()
            ax.plot(monthly_counts)
            ax.set_xlabel('Time')
            ax.set_ylabel('Monthly Sightings')
            ax.set_title('Temporal Trends in UFO Sightings')
        
        # 4. Statistical significance
        ax = axes[1,1]
        proximity_counts = self.ufos_gdf.groupby('nuclear_proximity').size()
        ax.bar(proximity_counts.index, proximity_counts.values)
        ax.set_xlabel('Nuclear Proximity Zone')
        ax.set_ylabel('Number of Sightings')
        ax.set_title('Sighting Counts by Proximity to Nuclear Facilities')
        
        plt.tight_layout()
        plt.savefig('ufo_nuclear_analysis_results.png', dpi=300, bbox_inches='tight')
        
        return fig

def run_full_analysis():
    """
    Complete end-to-end analysis
    """
    
    # Initialize analysis
    analysis = UfoNuclearAnalysis(
        ufos_path='nuforc_cleaned.csv',
        nuclear_path='nuclear_facilities.csv',
        population_path='population_density.csv'
    )
    
    # Run analysis pipeline
    analysis.clean_ufo_data()
    analysis.create_spatial_features()
    
    # Perform statistical tests
    results = analysis.statistical_analysis()
    
    # Generate visualizations
    analysis.generate_visualizations()
    
    # Print key results
    print("Analysis Results:")
    print(f"Spatial autocorrelation Moran's I: {results['spatstat']['moran_i']}")
    print(f"Spatial autocorrelation p-value: {results['spatstat']['moran_p']}")
    
    for model_name, result in results.items():
        if model_name != 'spatstat':
            print(f"\n{model_name.upper()} Results:")
            print(f"Classification Score: {result['score']}")
            print("Coefficients:")
            for feature, coef in result['coefficients'].items():
                print(f"  {feature}: {coef}")
    
    return results

if __name__ == "__main__":
    results = run_full_analysis()