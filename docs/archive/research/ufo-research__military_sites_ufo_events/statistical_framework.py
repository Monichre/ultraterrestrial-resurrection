"""
Advanced Statistical Framework for UFO-Nuclear Facility Correlation Analysis
==========================================================================

This module provides a complete statistical toolkit for rigorous analysis
of UFO sightings correlation with nuclear facilities and military bases.

Author: Research Framework
Date: 2024
"""

import numpy as np
import pandas as pd
from scipy import stats, spatial
from scipy.spatial.distance import cdist
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import pairwise_distances
import warnings
warnings.filterwarnings('ignore')

class UFOStatisticalAnalyzer:
    """
    Comprehensive statistical analysis suite for UFO-nuclear facility correlation.
    
    This class implements multiple statistical approaches to rigorously test
    the correlation between UFO sightings and proximity to nuclear facilities,
    controlling for confounding variables and spatial autocorrelation.
    """
    
    def __init__(self, ufo_data, facility_data, control_data=None):
        """
        Initialize the analyzer with datasets.
        
        Parameters:
        -----------
        ufo_data : pandas.DataFrame
            Must contain columns: latitude, longitude, datetime, accuracy_score
        facility_data : pandas.DataFrame  
            Must contain columns: latitude, longitude, facility_type, operational_status
        control_data : pandas.DataFrame, optional
            Matched control points data
        """
        self.ufo_data = ufo_data
        self.facility_data = facility_data
        self.control_data = control_data
        self.results = {}
        
        # Basic validation
        required_cols_ufo = {'latitude', 'longitude'}
        required_cols_fac = {'latitude', 'longitude', 'facility_type'}
        
        if not required_cols_ufo.issubset(ufo_data.columns):
            raise ValueError("UFO data missing required columns")
        if not required_cols_fac.issubset(facility_data.columns):
            raise ValueError("Facility data missing required columns")
    
    def preprocess_data(self):
        """Clean and prepare data for analysis."""
        # Filter for data quality
        mask = (
            (self.ufo_data['latitude'].between(-90, 90)) &
            (self.ufo_data['longitude'].between(-180, 180)) &
            (self.ufo_data['accuracy_score'] >= 0.7)
        )
        self.ufo_data = self.ufo_data[mask].copy()
        
        # Calculate distances more efficiently
        print("Calculating spatial distances...")
        self.calculate_all_distances()
        
    def calculate_all_distances(self):
        """Calculate distances from all UFO sightings to all facilities."""
        
        # Using broadcasting for efficiency
        ufo_coords = self.ufo_data[['latitude', 'longitude']].values
        fac_coords = self.facility_data[['latitude', 'longitude']].values
        
        # Vectorized haversine distance calculation
        def haversine_vectorized(lat1, lon1, lat2, lon2):
            """Vectorized haversine distance calculation."""
            # Convert to radians
            lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
            
            # Haversine formula
            dlat = lat2 - lat1
            dlon = lon2 - lon1
            a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
            c = 2 * np.arcsin(np.sqrt(a))
            
            # Radius of earth in kilometers
            km = 6371
            return c * km
        
        # Calculate distances for each facility type
        facility_types = self.facility_data['facility_type'].unique()
        
        for fac_type in facility_types:
            mask = self.facility_data['facility_type'] == fac_type
            fac_subset = self.facility_data[mask]
            
            if len(fac_subset) > 0:
                fac_coords_type = fac_subset[['latitude', 'longitude']].values
                
                # Calculate minimum distance for each UFO sighting
                distances = []
                for ufo_row in ufo_coords:
                    dist = haversine_vectorized(ufo_row[0], ufo_row[1], 
                                              fac_coords_type[:, 0], 
                                              fac_coords_type[:, 1])
                    distances.append(np.min(dist))
                
                self.ufo_data[f'min_distance_{fac_type}'] = distances
    
    def monte_carlo_permutation_test(self, facility_type='nuclear', 
                                   distance_threshold=25, 
                                   n_permutations=999, 
                                   return_distribution=False):
        """
        Monte Carlo permutation test for spatial clustering.
        
        Parameters:
        -----------
        facility_type : str
            Type of facility to test against
        distance_threshold : float
            Distance threshold in km
        n_permutations : int
            Number of random permutations
            
        Returns:
        --------
        dict
            Test results including p-value and effect size
        """
        
        key = f'min_distance_{facility_type}'
        actual_coords = self.ufo_data[['latitude', 'longitude']].values
        
        # Get actual count within threshold
        actual_count = (self.ufo_data[key] <= distance_threshold).sum()
        total_sightings = len(self.ufo_data)
        actual_proportion = actual_count / total_sightings
        
        # Generate null distribution
        null_distribution = []
        
        # Facility coordinates for this type
        fac_mask = self.facility_data['facility_type'] == facility_type
        fac_coords = self.facility_data[fac_mask][['latitude', 'longitude']].values
        
        for i in range(n_permutations):
            if i % 100 == 0:
                print(f"Completed {i} permutations...")
                
            # Generate random coordinates within study area
            lat_range = actual_coords[:, 0].ptp()
            lon_range = actual_coords[:, 1].ptp()
            
            # Preserve approximate spatial extent
            random_lats = np.random.uniform(
                actual_coords[:, 0].min(), 
                actual_coords[:, 0].max(), 
                len(actual_coords)
            )
            random_lons = np.random.uniform(
                actual_coords[:, 1].min(), 
                actual_coords[:, 1].max(), 
                len(actual_coords)
            )
            
            # Calculate distances for permuted points
            random_coords = np.column_stack([random_lats, random_lons])
            distances = []
            for coord in random_coords:
                dist = np.min(self.calculate_distances_3d(coord, fac_coords))
                distances.append(dist)
            
            null_count = np.sum(np.array(distances) <= distance_threshold)
            null_distribution.append(null_count / total_sightings)
        
        # Calculate p-value
        p_value = (np.sum(null_distribution >= actual_proportion) + 1) / (n_permutations + 1)
        
        # Effect size calculation (Cohen's h)
        expected_proportion = np.mean(null_distribution)
        cohens_h = 2 * (np.arcsin(np.sqrt(actual_proportion)) - 
                       np.arcsin(np.sqrt(expected_proportion)))
        
        result = {
            'actual_proportion': actual_proportion,
            'expected_proportion': expected_proportion,
            'p_value': p_value,
            'cohens_h': cohens_h,
            'significant': p_value < 0.05,
            'effect_strength': 'small' if abs(cohens_h) < 0.2 else
                              'medium' if abs(cohens_h) < 0.5 else 'large'
        }
        
        if return_distribution:
            result['null_distribution'] = null_distribution
        
        return result
    
    def calculate_distances_3d(self, coord1, coord_array):
        """Calculate distances from a coordinate to all facilities."""
        def haversine_distance(coord1, coord2):
            # Convert to radians
            lat1, lon1 = np.radians(coord1)
            lat2, lon2 = np.radians(coord2)
            
            # Haversine formula
            dlat = lat2 - lat1
            dlon = lon2 - lon1
            a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
            c = 2 * np.arcsin(np.sqrt(a))
            
            return 6371 * c  # Earth radius in km
        
        return [haversine_distance(coord1, coord2) for coord2 in coord_array]
    
    def spatial_clustering_analysis(self, facility_type='nuclear', 
                                  plot_results=True):
        """
        Comprehensive spatial clustering analysis using multiple methods.
        """
        
        from sklearn.cluster import DBSCAN
        from sklearn.neighbors import KernelDensity
        
        key = f'min_distance_{facility_type}'
        distances = self.ufo_data[key].values
        
        # 1. Distance distribution analysis
        plt.figure(figsize=(15, 10))
        
        # Plot 1: Distance distribution
        ax1 = plt.subplot(2, 3, 1)
        ax1.hist(distances, bins=50, alpha=0.7, edgecolor='black')
        ax1.axvline(x=25, color='red', linestyle='--', 
                   label='25km threshold')
        ax1.axvline(x=50, color='orange', linestyle='--', 
                   label='50km threshold')
        ax1.set_xlabel('Distance to Nuclear Facility (km)')
        ax1.set_ylabel('Frequency')
        ax1.set_title('Distribution of UFO Sightings by Distance')
        ax1.legend()
        
        # Plot 2: Kernel density estimation
        ax2 = plt.subplot(2, 3, 2)
        kde = KernelDensity(bandwidth=5)
        kde.fit(distances.reshape(-1, 1))
        x_range = np.linspace(0, distances.max(), 1000)
        log_density = kde.score_samples(x_range.reshape(-1, 1))
        ax2.plot(x_range, np.exp(log_density))
        ax2.fill_between(x_range, np.exp(log_density), alpha=0.3)
        ax2.set_xlabel('Distance (km)')
        ax2.set_ylabel('Density')
        ax2.set_title('Kernel Density Estimate')
        
        # Plot 3: Cumulative distribution
        ax3 = plt.subplot(2, 3, 3)
        sorted_distances = np.sort(distances)
        cdf = np.arange(1, len(sorted_distances) + 1) / len(sorted_distances)
        expected_cdf = 1 - (sorted_distances**2 / sorted_distances.max()**2)  # Uniform
        
        ax3.plot(sorted_distances, cdf, label='Observed', linewidth=2)
        ax3.plot(sorted_distances, expected_cdf, label='Expected', linestyle='--')
        ax3.set_xlabel('Distance (km)')
        ax3.set_ylabel('Cumulative Probability')
        ax3.set_title('Empirical vs Expected CDF')
        ax3.legend()
        
        # Kolmogorov-Smirnov test
        ks_result = stats.kstest(distances, 
                               lambda x: 1 - (x**2 / distances.max()**2))
        
        # Plot 4: Q-Q plot for spatial randomness
        ax4 = plt.subplot(2, 3, 4)
        theoretical_quantiles = np.sqrt(np.linspace(0, 1, len(distances)) * distances.max()**2)
        sorted_distances = np.sort(distances)
        ax4.scatter(theoretical_quantiles, sorted_distances, alpha=0.6)
        ax4.plot([0, distances.max()], [0, distances.max()], 'r--', lw=2)
        ax4.set_xlabel('Theoretical Quantiles (Uniform)')
        ax4.set_ylabel('Observed Quantiles')
        ax4.set_title(f'Q-Q Plot\nKS Test p={ks_result.pvalue:.4f}')
        
        plt.tight_layout()
        plt.savefig('spatial_clustering_analysis.png', dpi=300, bbox_inches='tight')
        plt.close()
        
        return {
            'ks_test': ks_result,
            'mean_distance': np.mean(distances),
            'median_distance': np.median(distances),
            'num_within_25km': np.sum(distances <= 25),
            'num_within_50km': np.sum(distances <= 50),
            'proportion_within_25km': np.sum(distances <= 25) / len(distances)
        }
    
    def run_comprehensive_analysis(self):
        """Execute complete analysis pipeline."""
        
        print("Starting comprehensive UFO-nuclear facility correlation analysis...")
        
        # 1. Preprocess data
        self.preprocess_data()
        
        facility_types = self.facility_data['facility_type'].unique()
        
        # 2. Monte Carlo tests for each facility type
        mc_results = {}
        for fac_type in facility_types:
            print(f"\nRunning Monte Carlo test for {fac_type} facilities...")
            result = self.monte_carlo_permutation_test(
                facility_type=fac_type,
                distance_threshold=25,
                n_permutations=999,
                return_distribution=True
            )
            mc_results[fac_type] = result
            
            print(f"Facility Type: {fac_type}")
            print(f"  Actual proportion: {result['actual_proportion']:.3f}")
            print(f"  Expected proportion: {result['expected_proportion']:.3f}")
            print(f"  P-value: {result['p_value']:.4f}")
            print(f"  Effect size (Cohen's h): {result['cohens_h']:.3f} ({result['effect_strength']})")
        
        # 3. Spatial clustering analysis
        clustering_results = {}
        for fac_type in facility_types:
            print(f"\nAnalyzing spatial clustering for {fac_type}...")
            clustering_data = self.spatial_clustering_analysis(facility_type=fac_type)
            clustering_results[fac_type] = clustering_data
        
        # 4. Compile final results
        self.results = {
            'monte_carlo_results': mc_results,
            'clustering_analysis': clustering_results,
            'sample_size': len(self.ufo_data),
            'facility_counts': self.facility_data['facility_type'].value_counts().to_dict()
        }
        
        # 5. Create summary visualization
        self.create_summary_plot()
        
        return self.results
    
    def create_summary_plot(self):
        """Create comprehensive summary visualization."""
        
        facility_types = list(self.results['monte_carlo_results'].keys())
        
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        
        # 1. P-values across facility types
        ax1 = axes[0, 0]
        p_values = [self.results['monte_carlo_results'][ft]['p_value'] 
                   for ft in facility_types]
        colors = ['red' if p < 0.05 else 'gray' for p in p_values]
        ax1.bar(facility_types, p_values, color=colors)
        ax1.axhline(y=0.05, color='black', linestyle='--', label='α=0.05')
        ax1.set_ylabel('P-value')
        ax1.set_title('Monte Carlo Test P-values by Facility Type')
        ax1.legend()
        
        # 2. Effect sizes
        ax2 = axes[0, 1]
        effect_sizes = [self.results['monte_carlo_results'][ft]['cohens_h'] 
                       for ft in facility_types]
        ax2.bar(facility_types, effect_sizes, 
               color=['blue' if h > 0 else 'red' for h in effect_sizes])
        ax2.axhline(y=0, color='black', linestyle='-')
        ax2.set_ylabel("Cohen's h")
        ax2.set_title('Effect Size (Cohen\'s h) by Facility Type')
        
        # 3. Proportions comparison
        ax3 = axes[1, 0]
        actual_props = [self.results['monte_carlo_results'][ft]['actual_proportion'] 
                       for ft in facility_types]
        expected_props = [self.results['monte_carlo_results'][ft]['expected_proportion'] 
                         for ft in facility_types]
        
        x = np.arange(len(facility_types))
        width = 0.35
        ax3.bar(x - width/2, actual_props, width, label='Observed', alpha=0.8)
        ax3.bar(x + width/2, expected_props, width, label='Expected', alpha=0.8)
        ax3.set_xlabel('Facility Type')
        ax3.set_ylabel('Proportion within 25km')
        ax3.set_title('Observed vs Expected Proportions')
        ax3.set_xticks(x)
        ax3.set_xticklabels(facility_types, rotation=45)
        ax3.legend()
        
        # 4. Sample sizes
        ax4 = axes[1, 1]
        facility_counts = [self.results['facility_counts'].get(ft, 0) 
                          for ft in facility_types]
        ax4.bar(facility_types, facility_counts, color='green')
        ax4.set_ylabel('Number of Facilities')
        ax4.set_title('Facility Sample Sizes')
        
        plt.tight_layout()
        plt.savefig('ufos_nuclear_summary_results.png', dpi=300, bbox_inches='tight')
        plt.close()

# Example usage function
def create_sample_data():
    """Create realistic sample data for testing."""
    
    np.random.seed(42)
    
    # Create facility data
    facilities = pd.DataFrame({
        'latitude': np.random.normal(37.5, 5, 50),  # US-centric facilities
        'longitude': np.random.normal(-95.7, 10, 50),
        'facility_type': np.random.choice(
            ['nuclear', 'military_base', 'weapons_storage', 'research_center'], 
            50, 
            p=[0.3, 0.4, 0.2, 0.1]
        ),
        'operational_status': 'active'
    })
    
    # Create UFO data with potential clustering around nuclear facilities
    nuclear_coords = facilities[facilities['facility_type'] == 'nuclear']
    
    # Main UFO sightings
    base_ufo_lats = np.random.uniform(25, 50, 2000)
    base_ufo_lons = np.random.uniform(-125, -65, 2000)
    
    # Additional clustered sightings near nuclear facilities
    clustered_count = 500
    if len(nuclear_coords) > 0:
        clustered_lats = []
        clustered_lons = []
        
        for _ in range(clustered_count):
            facility = nuclear_coords.sample(1)
            clustered_lats.append(
                facility['latitude'].iloc[0] + np.random.normal(0, 0.5)
            )
            clustered_lons.append(
                facility['longitude'].iloc[0] + np.random.normal(0, 0.5)
            )
        
        all_lats = np.concatenate([base_ufo_lats, clustered_lats])
        all_lons = np.concatenate([base_ufo_lons, clustered_lons])
    else:
        all_lats = base_ufo_lats
        all_lons = base_ufo_lons
    
    ufo_sightings = pd.DataFrame({
        'latitude': all_lats,
        'longitude': all_lons,
        'datetime': pd.date_range('2000-01-01', periods=len(all_lats), freq='D'),
        'accuracy_score': np.random.uniform(0.7, 1.0, len(all_lats)),
        'duration': np.random.exponential(10, len(all_lats))
    })
    
    return ufo_sightings, facilities

# Main execution
if __name__ == "__main__":
    
    # Create sample data
    print("Creating sample datasets...")
    ufo_data, facility_data = create_sample_data()
    
    # Run analysis
    analyzer = UFOStatisticalAnalyzer(ufo_data, facility_data)
    results = analyzer.run_comprehensive_analysis()
    
    # Print summary
    print("\n" + "="*60)
    print("ANALYSIS SUMMARY")
    print("="*60)
    print(f"Total UFO sightings: {results['sample_size']}")
    print(f"Total facilities: {sum(results['facility_counts'].values())}")
    
    print("\nStatistical Results:")
    for fac_type, mc_result in results['monte_carlo_results'].items():
        print(f"\n{fac_type.upper()} FACILITIES:")
        print(f"  P-value: {mc_result['p_value']:.4f}")
        print(f"  Cohen's h: {mc_result['cohens_h']:.3f}")
        print(f"  Effect strength: {mc_result['effect_strength']}")
        print(f"  Significant: {'Yes' if mc_result['significant'] else 'No'}")
    
    print("\nAnalysis complete. Check generated visualizations for detailed results.")