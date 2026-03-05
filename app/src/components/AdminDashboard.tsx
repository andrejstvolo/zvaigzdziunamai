import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Calendar, Settings, LogOut, Menu,
  TrendingUp, DollarSign, UserCheck, Bell,
  ChevronRight, Search, Download, Plus, Edit,
  CheckCircle, XCircle, Clock, Eye, CreditCard,
  Globe, Percent, Phone
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Types
interface Booking {
  id: string;
  customer: string;
  email: string;
  phone: string;
  accommodation: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  notes?: string;
}

interface Accommodation {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  capacity: number;
  image: string;
  active: boolean;
}

interface DayStatus {
  date: string;
  isBooked: boolean;
  isBlocked: boolean;
  customPrice: number | null;
  bookingId?: string;
  customerName?: string;
}

// Mock data
const MOCK_BOOKINGS: Booking[] = [
  { id: '1', customer: 'Jonas Petraitis', email: 'jonas@email.lt', phone: '+37061234567', accommodation: 'Kupolas "Žvaigždė"', checkIn: '2025-03-15', checkOut: '2025-03-17', guests: 2, total: 240, status: 'paid', paymentStatus: 'paid', createdAt: '2025-03-01' },
  { id: '2', customer: 'Ona Kazlauskienė', email: 'ona@email.lt', phone: '+37069876543', accommodation: 'Kupolas "Mėnulis"', checkIn: '2025-03-20', checkOut: '2025-03-22', guests: 4, total: 200, status: 'confirmed', paymentStatus: 'pending', createdAt: '2025-03-02' },
  { id: '3', customer: 'Petras Jonaitis', email: 'petras@email.lt', phone: '+37061112233', accommodation: 'Kupolas "Saulė"', checkIn: '2025-04-01', checkOut: '2025-04-03', guests: 2, total: 300, status: 'pending', paymentStatus: 'pending', createdAt: '2025-03-05' },
];

const ACCOMMODATIONS: Accommodation[] = [
  { id: '1', name: 'Kupolas "Žvaigždė"', description: 'Prabangus kupolas su panoraminiu stogu', basePrice: 120, capacity: 4, image: '/dome_sunset_real.jpg', active: true },
  { id: '2', name: 'Kupolas "Mėnulis"', description: 'Jaukus kupolas su vaizdu į ežerą', basePrice: 100, capacity: 2, image: '/dome_interior_real.jpg', active: true },
  { id: '3', name: 'Kupolas "Saulė"', description: 'Šeimyninis kupolas', basePrice: 150, capacity: 6, image: '/dome_night_stars.jpg', active: true },
  { id: '4', name: 'Kupolas "Vėjas"', description: 'Romantiškas kupolas', basePrice: 130, capacity: 4, image: '/dome_river_sunset.jpg', active: true },
];

// Generate calendar days
const generateCalendarDays = (year: number, month: number, accommodationId: string): DayStatus[] => {
  const days: DayStatus[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Check if date is booked
    const booking = MOCK_BOOKINGS.find(b => 
      b.accommodation === ACCOMMODATIONS.find(a => a.id === accommodationId)?.name &&
      date >= b.checkIn && date < b.checkOut
    );
    
    days.push({
      date,
      isBooked: !!booking,
      isBlocked: false,
      customPrice: null,
      bookingId: booking?.id,
      customerName: booking?.customer
    });
  }
  
  return days;
};

// Admin Calendar Component
const AdminCalendar = ({ accommodationId }: { accommodationId: string }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarDays, setCalendarDays] = useState<DayStatus[]>([]);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [customPrice, setCustomPrice] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    setCalendarDays(generateCalendarDays(year, month, accommodationId));
  }, [year, month, accommodationId]);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDateClick = (day: DayStatus) => {
    setSelectedDate(day.date);
    setCustomPrice(day.customPrice?.toString() || '');
    setIsBlocked(day.isBlocked);
    setShowPriceModal(true);
  };

  const handleSave = () => {
    // API call to save price/block status
    setShowPriceModal(false);
  };

  const monthNames = ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis', 'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'];
  const weekDays = ['Pr', 'A', 'T', 'K', 'Pn', 'Š', 'S'];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handlePrevMonth}>
          <ChevronRight className="w-5 h-5 rotate-180" />
        </Button>
        <h3 className="text-xl font-semibold text-ivory">
          {monthNames[month]} {year}
        </h3>
        <Button variant="outline" onClick={handleNextMonth}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500/30 border border-green-500 rounded" />
          <span className="text-slate">Laisva</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500/30 border border-red-500 rounded" />
          <span className="text-slate">Užimta</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-500/30 border border-gray-500 rounded" />
          <span className="text-slate">Užblokuota</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-[#0B0F17] rounded-lg p-4">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-slate py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: adjustedFirstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {calendarDays.map((day) => (
            <button
              key={day.date}
              onClick={() => handleDateClick(day)}
              className={`
                aspect-square p-2 rounded-lg text-center transition-all relative
                ${day.isBooked 
                  ? 'bg-red-500/20 border border-red-500/50 hover:bg-red-500/30' 
                  : day.isBlocked
                    ? 'bg-gray-500/20 border border-gray-500/50 hover:bg-gray-500/30'
                    : 'bg-green-500/10 border border-green-500/30 hover:bg-green-500/20'
                }
              `}
            >
              <div className="text-ivory font-medium">{new Date(day.date).getDate()}</div>
              {day.customPrice && (
                <div className="text-xs text-gold">€{day.customPrice}</div>
              )}
              {day.isBooked && day.customerName && (
                <div className="absolute bottom-1 left-1 right-1 text-[10px] text-red-400 truncate">
                  {day.customerName}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price/Block Modal */}
      <Dialog open={showPriceModal} onOpenChange={setShowPriceModal}>
        <DialogContent className="bg-[#141B24] border-white/10 text-ivory">
          <DialogHeader>
            <DialogTitle className="text-ivory">
              {selectedDate && new Date(selectedDate).toLocaleDateString('lt-LT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-ivory">Kaina (€)</Label>
              <Input 
                type="number" 
                value={customPrice} 
                onChange={(e) => setCustomPrice(e.target.value)}
                placeholder="Palikite tuščią naudoti bazinę kainą"
                className="bg-[#0B0F17] border-white/10 text-ivory"
              />
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={isBlocked} 
                onChange={(e) => setIsBlocked(e.target.checked)}
                className="w-4 h-4"
              />
              <Label className="text-ivory">Užblokuoti šią datą</Label>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowPriceModal(false)} className="flex-1">Atšaukti</Button>
              <Button onClick={handleSave} className="flex-1 bg-gold text-[#0B0F17]">Išsaugoti</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Bookings Management
const BookingsManager = () => {
  const [bookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter(b => {
    if (filter !== 'all' && b.status !== filter) return false;
    if (search && !b.customer.toLowerCase().includes(search.toLowerCase()) && !b.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Apmokėta</Badge>;
      case 'confirmed': return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">Patvirtinta</Badge>;
      case 'pending': return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">Laukiama</Badge>;
      case 'cancelled': return <Badge className="bg-red-500/20 text-red-400 border-red-500/50">Atšaukta</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
            <Input 
              placeholder="Ieškoti pagal vardą ar el. paštą..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-[#0B0F17] border-white/10 text-ivory"
            />
          </div>
        </div>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-[#0B0F17] border border-white/10 text-ivory"
        >
          <option value="all">Visi užsakymai</option>
          <option value="pending">Laukiantys</option>
          <option value="confirmed">Patvirtinti</option>
          <option value="paid">Apmokėti</option>
          <option value="cancelled">Atšaukti</option>
        </select>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" /> Eksportuoti
        </Button>
      </div>

      {/* Bookings Table */}
      <div className="bg-[#0B0F17] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#141B24]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate">Klientas</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate">Kupolas</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate">Datos</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate">Suma</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate">Statusas</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate">Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="px-4 py-3 text-sm text-ivory">#{booking.id}</td>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-ivory">{booking.customer}</p>
                  <p className="text-xs text-slate">{booking.email}</p>
                </td>
                <td className="px-4 py-3 text-sm text-ivory">{booking.accommodation}</td>
                <td className="px-4 py-3 text-sm text-ivory">
                  {new Date(booking.checkIn).toLocaleDateString('lt-LT')} - {new Date(booking.checkOut).toLocaleDateString('lt-LT')}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-gold">€{booking.total}</td>
                <td className="px-4 py-3">{getStatusBadge(booking.status)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(booking)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Booking Detail Modal */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-lg bg-[#141B24] border-white/10 text-ivory">
          <DialogHeader>
            <DialogTitle className="text-ivory">Užsakymo informacija #{selectedBooking?.id}</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate">Klientas</Label>
                  <p className="text-ivory font-medium">{selectedBooking.customer}</p>
                </div>
                <div>
                  <Label className="text-slate">El. paštas</Label>
                  <p className="text-ivory">{selectedBooking.email}</p>
                </div>
                <div>
                  <Label className="text-slate">Telefonas</Label>
                  <p className="text-ivory">{selectedBooking.phone}</p>
                </div>
                <div>
                  <Label className="text-slate">Svečių skaičius</Label>
                  <p className="text-ivory">{selectedBooking.guests}</p>
                </div>
              </div>
              <div>
                <Label className="text-slate">Apgyvendinimas</Label>
                <p className="text-ivory">{selectedBooking.accommodation}</p>
              </div>
              <div>
                <Label className="text-slate">Datos</Label>
                <p className="text-ivory">{new Date(selectedBooking.checkIn).toLocaleDateString('lt-LT')} - {new Date(selectedBooking.checkOut).toLocaleDateString('lt-LT')}</p>
              </div>
              <div className="flex justify-between items-center p-4 bg-gold/10 rounded-lg">
                <span className="text-ivory font-medium">Viso:</span>
                <span className="text-2xl font-bold text-gold">€{selectedBooking.total}</span>
              </div>
              <div className="flex gap-3">
                {selectedBooking.status === 'pending' && (
                  <Button className="flex-1 bg-blue-500 text-white">
                    <CheckCircle className="w-4 h-4 mr-2" /> Patvirtinti
                  </Button>
                )}
                {selectedBooking.status !== 'cancelled' && (
                  <Button variant="outline" className="flex-1 border-red-500 text-red-400">
                    <XCircle className="w-4 h-4 mr-2" /> Atšaukti
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Dashboard Stats
const DashboardStats = () => {
  const stats = [
    { title: 'Viso užsakymų', value: '24', change: '+12%', icon: TrendingUp, color: 'text-green-400' },
    { title: 'Pajamos šį mėn.', value: '€3,240', change: '+8%', icon: DollarSign, color: 'text-gold' },
    { title: 'Laukiantys', value: '5', change: '-2', icon: Clock, color: 'text-yellow-400' },
    { title: 'Šiandien atvyksta', value: '3', change: '', icon: UserCheck, color: 'text-blue-400' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} className="bg-[#0B0F17] border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate">{stat.title}</p>
                <p className="text-2xl font-bold text-ivory mt-1">{stat.value}</p>
                {stat.change && (
                  <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change} nuo praėjusio mėn.
                  </p>
                )}
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// CMS Settings
const CMSSettings = () => {
  const [settings, setSettings] = useState({
    siteTitle: 'Žvaigždžių Namai',
    siteDescription: 'Prabangus glamping prie Mikytų ežero',
    phone: '+37060000000',
    email: 'labas@zvaigzdziunamai.lt',
    address: 'Mikytų k., Šakių raj.',
    facebook: '',
    instagram: '',
    lowSeasonPrice: 100,
    highSeasonPrice: 150,
    weekendPrice: 180,
  });

  return (
    <div className="space-y-6">
      <Card className="bg-[#0B0F17] border-white/10">
        <CardHeader>
          <CardTitle className="text-ivory flex items-center gap-2">
            <Globe className="w-5 h-5" /> Svetainės informacija
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-ivory">Svetainės pavadinimas</Label>
            <Input 
              value={settings.siteTitle} 
              onChange={(e) => setSettings({...settings, siteTitle: e.target.value})}
              className="bg-[#141B24] border-white/10 text-ivory"
            />
          </div>
          <div>
            <Label className="text-ivory">Aprašymas</Label>
            <Input 
              value={settings.siteDescription} 
              onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
              className="bg-[#141B24] border-white/10 text-ivory"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#0B0F17] border-white/10">
        <CardHeader>
          <CardTitle className="text-ivory flex items-center gap-2">
            <Phone className="w-5 h-5" /> Kontaktai
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-ivory">Telefonas</Label>
              <Input 
                value={settings.phone} 
                onChange={(e) => setSettings({...settings, phone: e.target.value})}
                className="bg-[#141B24] border-white/10 text-ivory"
              />
            </div>
            <div>
              <Label className="text-ivory">El. paštas</Label>
              <Input 
                value={settings.email} 
                onChange={(e) => setSettings({...settings, email: e.target.value})}
                className="bg-[#141B24] border-white/10 text-ivory"
              />
            </div>
          </div>
          <div>
            <Label className="text-ivory">Adresas</Label>
            <Input 
              value={settings.address} 
              onChange={(e) => setSettings({...settings, address: e.target.value})}
              className="bg-[#141B24] border-white/10 text-ivory"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#0B0F17] border-white/10">
        <CardHeader>
          <CardTitle className="text-ivory flex items-center gap-2">
            <Percent className="w-5 h-5" /> Bazinės kainos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-ivory">Žemasis sezonas (€)</Label>
              <Input 
                type="number"
                value={settings.lowSeasonPrice} 
                onChange={(e) => setSettings({...settings, lowSeasonPrice: Number(e.target.value)})}
                className="bg-[#141B24] border-white/10 text-ivory"
              />
            </div>
            <div>
              <Label className="text-ivory">Aukštasis sezonas (€)</Label>
              <Input 
                type="number"
                value={settings.highSeasonPrice} 
                onChange={(e) => setSettings({...settings, highSeasonPrice: Number(e.target.value)})}
                className="bg-[#141B24] border-white/10 text-ivory"
              />
            </div>
            <div>
              <Label className="text-ivory">Savaitgalis (€)</Label>
              <Input 
                type="number"
                value={settings.weekendPrice} 
                onChange={(e) => setSettings({...settings, weekendPrice: Number(e.target.value)})}
                className="bg-[#141B24] border-white/10 text-ivory"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button className="bg-gold text-[#0B0F17]">
        <CheckCircle className="w-4 h-4 mr-2" /> Išsaugoti pakeitimus
      </Button>
    </div>
  );
};

// Main Admin Dashboard
export const AdminDashboard = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAccommodation, setSelectedAccommodation] = useState(ACCOMMODATIONS[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Kalendorius', icon: Calendar },
    { id: 'bookings', label: 'Užsakymai', icon: CreditCard },
    { id: 'settings', label: 'Nustatymai', icon: Settings },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0 bg-[#0B0F17] border-white/10 overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-[#141B24] border-r border-white/10 transition-all duration-300 flex flex-col`}>
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              {sidebarOpen && <span className="text-xl font-bold text-gold">Admin</span>}
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu className="w-5 h-5 text-ivory" />
              </Button>
            </div>
            
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id 
                      ? 'bg-gold/20 text-gold' 
                      : 'text-slate hover:bg-white/5 hover:text-ivory'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-white/10">
              <button 
                onClick={onClose}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate hover:bg-white/5 hover:text-ivory transition-colors"
              >
                <LogOut className="w-5 h-5" />
                {sidebarOpen && <span>Atsijungti</span>}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-ivory">
                  {menuItems.find(m => m.id === activeTab)?.label}
                </h1>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-[#0B0F17] font-bold">
                      A
                    </div>
                    <span className="text-ivory">Admin</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <DashboardStats />
                  
                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card className="bg-[#141B24] border-white/10">
                      <CardHeader>
                        <CardTitle className="text-ivory">Naujausi užsakymai</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {MOCK_BOOKINGS.slice(0, 3).map(b => (
                            <div key={b.id} className="flex items-center justify-between p-3 bg-[#0B0F17] rounded-lg">
                              <div>
                                <p className="text-ivory font-medium">{b.customer}</p>
                                <p className="text-sm text-slate">{b.accommodation}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-gold font-bold">€{b.total}</p>
                                <p className="text-xs text-slate">{new Date(b.checkIn).toLocaleDateString('lt-LT')}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#141B24] border-white/10">
                      <CardHeader>
                        <CardTitle className="text-ivory">Greitos nuorodos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                            <Calendar className="w-6 h-6" />
                            <span>Kalendorius</span>
                          </Button>
                          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                            <CreditCard className="w-6 h-6" />
                            <span>Užsakymai</span>
                          </Button>
                          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                            <Percent className="w-6 h-6" />
                            <span>Kainos</span>
                          </Button>
                          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                            <Settings className="w-6 h-6" />
                            <span>Nustatymai</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'calendar' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <select 
                      value={selectedAccommodation}
                      onChange={(e) => setSelectedAccommodation(e.target.value)}
                      className="px-4 py-2 rounded-lg bg-[#141B24] border border-white/10 text-ivory"
                    >
                      {ACCOMMODATIONS.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" /> Užblokuoti datas
                    </Button>
                  </div>
                  <AdminCalendar accommodationId={selectedAccommodation} />
                </div>
              )}

              {activeTab === 'bookings' && <BookingsManager />}

              {activeTab === 'settings' && <CMSSettings />}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDashboard;
