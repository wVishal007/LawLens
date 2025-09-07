import React, { useState } from 'react'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { LawyerCard } from '../components/features/LawyerCard'
import { Modal } from '../components/ui/Modal'
import { Users, Search, Filter, MapPin } from 'lucide-react'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { addNotification } from '../redux/slices/uiSlice'

interface Lawyer {
  id: string
  name: string
  specialization: string
  experience: number
  rating: number
  location: string
  hourlyRate: number
}

const mockLawyers: Lawyer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    specialization: 'Employment Law',
    experience: 12,
    rating: 5,
    location: 'New York, NY',
    hourlyRate: 350
  },
  {
    id: '2',
    name: 'Michael Chen',
    specialization: 'Contract Law',
    experience: 8,
    rating: 5,
    location: 'San Francisco, CA',
    hourlyRate: 425
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    specialization: 'Real Estate Law',
    experience: 15,
    rating: 4,
    location: 'Austin, TX',
    hourlyRate: 300
  },
  {
    id: '4',
    name: 'David Thompson',
    specialization: 'Business Law',
    experience: 20,
    rating: 5,
    location: 'Chicago, IL',
    hourlyRate: 500
  },
  {
    id: '5',
    name: 'Lisa Park',
    specialization: 'Family Law',
    experience: 10,
    rating: 4,
    location: 'Los Angeles, CA',
    hourlyRate: 275
  },
  {
    id: '6',
    name: 'Robert Wilson',
    specialization: 'Criminal Law',
    experience: 18,
    rating: 5,
    location: 'Miami, FL',
    hourlyRate: 400
  }
]

export const Lawyers: React.FC = () => {
  const dispatch = useAppDispatch()
  const [lawyers] = useState<Lawyer[]>(mockLawyers)
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>(mockLawyers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [consultationModal, setConsultationModal] = useState<{ open: boolean; lawyer?: Lawyer }>({ open: false })

  const specializations = [...new Set(lawyers.map(l => l.specialization))]
  const locations = [...new Set(lawyers.map(l => l.location))]

  const handleSearch = () => {
    let filtered = lawyers

    if (searchTerm) {
      filtered = filtered.filter(lawyer => 
        lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedSpecialization) {
      filtered = filtered.filter(lawyer => lawyer.specialization === selectedSpecialization)
    }

    if (selectedLocation) {
      filtered = filtered.filter(lawyer => lawyer.location === selectedLocation)
    }

    setFilteredLawyers(filtered)
  }

  React.useEffect(() => {
    handleSearch()
  }, [searchTerm, selectedSpecialization, selectedLocation])

  const handleRequestConsultation = (lawyerId: string) => {
    const lawyer = lawyers.find(l => l.id === lawyerId)
    if (lawyer) {
      setConsultationModal({ open: true, lawyer })
    }
  }

  const handleSubmitConsultation = () => {
    setConsultationModal({ open: false })
    dispatch(addNotification({
      type: 'success',
      message: `Consultation request sent to ${consultationModal.lawyer?.name}. They will contact you within 24 hours.`
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Find Legal Experts</h1>
          <p className="text-gray-600">Connect with qualified attorneys who can help with your legal needs</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600">
              {filteredLawyers.length} lawyer{filteredLawyers.length !== 1 ? 's' : ''} found
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Sorted by rating and experience
          </div>
        </div>

        {/* Lawyers Grid */}
        {filteredLawyers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lawyers found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLawyers.map((lawyer) => (
              <LawyerCard
                key={lawyer.id}
                lawyer={lawyer}
                onRequestConsultation={handleRequestConsultation}
              />
            ))}
          </div>
        )}

        {/* Consultation Request Modal */}
        <Modal
          isOpen={consultationModal.open}
          onClose={() => setConsultationModal({ open: false })}
          title="Request Consultation"
          size="md"
        >
          {consultationModal.lawyer && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-lg">{consultationModal.lawyer.name}</h3>
                <p className="text-gray-600">{consultationModal.lawyer.specialization}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {consultationModal.lawyer.experience} years experience • ${consultationModal.lawyer.hourlyRate}/hour
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Your Name"
                  placeholder="John Doe"
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="john@example.com"
                />
                <Input
                  label="Phone Number"
                  placeholder="+1 (555) 123-4567"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your legal matter
                  </label>
                  <textarea
                    className="w-full h-24 px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Please provide details about your legal question or situation..."
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setConsultationModal({ open: false })}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitConsultation}
                  className="flex-1"
                >
                  Send Request
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}