import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import axios from 'axios'
import { Search, Locate, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'react-hot-toast'

// Fix for default marker icon in leaflet with webpack/vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
    value: { lat: number; lng: number }
    onChange: (coords: { lat: number; lng: number }) => void
}

// Component to handle map clicks
function LocationMarker({ value, onChange }: MapPickerProps) {
    useMapEvents({
        click(e) {
            onChange(e.latlng)
        },
    })
    return value ? <Marker position={value} /> : null
}

// Component to programmatically move the map
function MapController({ center }: { center: { lat: number, lng: number } }) {
    const map = useMap()
    map.flyTo(center, 13)
    return null
}

const MapPicker = ({ value, onChange }: MapPickerProps) => {
    // Default center (Bangalore) if no value
    const defaultCenter = { lat: 12.9716, lng: 77.5946 }
    const center = (value && value.lat && value.lng) ? value : defaultCenter

    const [searchQuery, setSearchQuery] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [isLocating, setIsLocating] = useState(false)

    // Handle Search
    const handleSearch = async () => {
        if (!searchQuery.trim()) return

        setIsSearching(true)
        try {
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: searchQuery,
                    format: 'json',
                    limit: 1
                }
            })

            if (response.data && response.data.length > 0) {
                const result = response.data[0]
                const lat = parseFloat(result.lat)
                const lng = parseFloat(result.lon)

                onChange({ lat, lng })
                toast.success(`Found: ${result.display_name.split(',')[0]}`)
            } else {
                toast.error('Location not found')
            }
        } catch (error) {
            console.error(error)
            toast.error('Search failed')
        } finally {
            setIsSearching(false)
        }
    }

    // Handle Current Location
    const handleCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser')
            return
        }

        setIsLocating(true)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                onChange({ lat: latitude, lng: longitude })
                toast.success('Location updated')
                setIsLocating(false)
            },
            (error) => {
                console.error(error)
                toast.error('Unable to retrieve your location')
                setIsLocating(false)
            }
        )
    }

    return (
        <div className="space-y-2">
            {/* Search Bar Row */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search for a place (e.g. MG Road, Bangalore)"
                        className="pl-9 bg-white dark:bg-neutral-950"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <Button
                    variant="secondary"
                    onClick={handleSearch}
                    disabled={isSearching}
                >
                    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
                </Button>
                <Button
                    variant="outline"
                    title="Use Current Location"
                    onClick={handleCurrentLocation}
                    disabled={isLocating}
                >
                    {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Locate className="h-4 w-4" />}
                </Button>
            </div>

            {/* Map Container */}
            <div className="h-[300px] w-full rounded-lg overflow-hidden border border-slate-300 dark:border-neutral-800 z-0 relative">
                <MapContainer
                    center={center}
                    zoom={13}
                    scrollWheelZoom={true} // Enabled scroll zoom for better usability
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker value={value} onChange={onChange} />
                    <MapController center={center} />
                </MapContainer>

                {/* Lat/Lng Overlay */}
                <div className="absolute bottom-1 right-1 bg-white/80 dark:bg-black/80 px-2 py-1 text-[10px] rounded z-[1000] pointer-events-none text-slate-600 dark:text-neutral-400 font-mono">
                    {value?.lat?.toFixed(6) || '-'}, {value?.lng?.toFixed(6) || '-'}
                </div>
            </div>
        </div>
    )
}

export default MapPicker
