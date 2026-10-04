import { useState, useMemo } from 'react'
import { Search, Filter, Star, Rocket, Eye, User, Database, Shield, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { astronauts, verificationLevels, categories, stats } from './data/astronauts.js'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVerification, setSelectedVerification] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedAstronaut, setSelectedAstronaut] = useState(null)

  const filteredAstronauts = useMemo(() => {
    return astronauts.filter(astronaut => {
      const matchesSearch = astronaut.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           astronaut.mission.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           astronaut.keyStatement.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesVerification = selectedVerification === 'all' || astronaut.verificationLevel === selectedVerification
      const matchesCategory = selectedCategory === 'all' || astronaut.category === selectedCategory
      
      return matchesSearch && matchesVerification && matchesCategory
    })
  }, [searchTerm, selectedVerification, selectedCategory])

  const getVerificationColor = (level) => {
    switch(level) {
      case 'HIGH': return 'bg-green-100 text-green-800 border-green-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Mission Sightings': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Personal Beliefs': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Government Secrecy': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Misattributed': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Rocket className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Astronaut UFO Database</h1>
          </div>
          <p className="text-blue-200 text-lg">
            Comprehensive Research on US Astronaut UFO/UAP Testimonies
          </p>
          <p className="text-blue-300 text-sm mt-2">
            Verified documentation of {stats.totalAstronauts} astronauts with UFO-related statements
          </p>
        </div>
      </header>

      {/* Stats Dashboard */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Astronauts</CardTitle>
              <Database className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalAstronauts}</div>
              <p className="text-xs text-blue-200">Documented cases</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">High Confidence</CardTitle>
              <Shield className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.highConfidence}</div>
              <p className="text-xs text-blue-200">Verified testimonies</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Mission Sightings</CardTitle>
              <Eye className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.missionSightings}</div>
              <p className="text-xs text-blue-200">During space missions</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Personal Beliefs</CardTitle>
              <User className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.personalBeliefs}</div>
              <p className="text-xs text-blue-200">ET life statements</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search astronauts, missions, or statements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                />
              </div>
              
              <Select value={selectedVerification} onValueChange={setSelectedVerification}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="Verification Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Verification Levels</SelectItem>
                  <SelectItem value="HIGH">High Confidence</SelectItem>
                  <SelectItem value="MEDIUM">Medium Confidence</SelectItem>
                  <SelectItem value="LOW">Low Confidence</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Mission Sightings">Mission Sightings</SelectItem>
                  <SelectItem value="Personal Beliefs">Personal Beliefs</SelectItem>
                  <SelectItem value="Government Secrecy">Government Secrecy</SelectItem>
                  <SelectItem value="Misattributed">Misattributed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Astronaut Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAstronauts.map((astronaut) => (
            <Card 
              key={astronaut.id} 
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => setSelectedAstronaut(astronaut)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">{astronaut.name}</CardTitle>
                    <CardDescription className="text-blue-200">
                      {astronaut.mission} • {astronaut.year}
                    </CardDescription>
                  </div>
                  {astronaut.photo && (
                    <img 
                      src={astronaut.photo} 
                      alt={astronaut.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                    />
                  )}
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Badge className={getVerificationColor(astronaut.verificationLevel)}>
                    {astronaut.verificationLevel}
                  </Badge>
                  <Badge className={getCategoryColor(astronaut.category)}>
                    {astronaut.category}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-blue-100 text-sm italic mb-3">
                  "{astronaut.keyStatement.substring(0, 120)}..."
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-white text-sm">{astronaut.confidence}% Confidence</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAstronauts.length === 0 && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center py-12">
            <CardContent>
              <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">No Results Found</h3>
              <p className="text-blue-200">Try adjusting your search criteria or filters.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Detailed Modal */}
      {selectedAstronaut && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-white/95 backdrop-blur-sm max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl text-gray-900">{selectedAstronaut.name}</CardTitle>
                  <CardDescription className="text-lg">
                    {selectedAstronaut.mission} • {selectedAstronaut.role} • {selectedAstronaut.year}
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedAstronaut(null)}
                  className="ml-4"
                >
                  Close
                </Button>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Badge className={getVerificationColor(selectedAstronaut.verificationLevel)}>
                  {selectedAstronaut.verificationLevel} CONFIDENCE
                </Badge>
                <Badge className={getCategoryColor(selectedAstronaut.category)}>
                  {selectedAstronaut.category}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {selectedAstronaut.photo && (
                <div className="flex justify-center">
                  <img 
                    src={selectedAstronaut.photo} 
                    alt={selectedAstronaut.name}
                    className="w-48 h-48 rounded-lg object-cover border-4 border-gray-200"
                  />
                </div>
              )}
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Key Statement</h4>
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700">
                  "{selectedAstronaut.keyStatement}"
                </blockquote>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Detailed Analysis</h4>
                <p className="text-gray-700">{selectedAstronaut.detailedStatement}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Authority Metrics</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {selectedAstronaut.authorityMetrics.map((metric, index) => (
                    <li key={index}>{metric}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Verification Status</h4>
                <p className="text-gray-700">{selectedAstronaut.verificationStatus}</p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold">{selectedAstronaut.confidence}% Confidence Rating</span>
                </div>
                {selectedAstronaut.nasaBio && (
                  <Button asChild>
                    <a href={selectedAstronaut.nasaBio} target="_blank" rel="noopener noreferrer">
                      View NASA Bio
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-blue-200">
            <p className="mb-2">
              Comprehensive research database compiled by Manus AI • July 2025
            </p>
            <p className="text-sm text-blue-300">
              Based on verified sources, NASA records, and independent analysis including James Oberg's critical assessment
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

