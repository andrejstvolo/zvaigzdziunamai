import { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, CreditCard } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface BookingData {
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  accommodationId: string | null;
}

const ACCOMMODATIONS = [
  { id: '1', name: 'Kupolas "Žvaigždė"', price: 120, image: '/dome_sunset_real.jpg', amenities: ['WiFi', 'Kondicionierius'] },
  { id: '2', name: 'Kupolas "Mėnulis"', price: 100, image: '/dome_interior_real.jpg', amenities: ['Jacuzzi'] },
  { id: '3', name: 'Kupolas "Saulė"', price: 150, image: '/dome_night_stars.jpg', amenities: ['Virtuvėlė'] },
  { id: '4', name: 'Kupolas "Vėjas"', price: 130, image: '/dome_river_sunset.jpg', amenities: ['Židinys'] },
];

export const BookingWizard = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BookingData>({ checkIn: null, checkOut: null, guests: 2, accommodationId: null });
  const [done, setDone] = useState(false);

  const nights = data.checkIn && data.checkOut 
    ? Math.ceil((new Date(data.checkOut).getTime() - new Date(data.checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const total = data.accommodationId 
    ? (ACCOMMODATIONS.find(a => a.id === data.accommodationId)?.price || 0) * nights
    : 0;

  if (done) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-[#141B24] border-white/10 text-ivory">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ačiū už užsakymą!</h3>
            <p className="text-slate mb-4">Patvirtinimą išsiuntėme į jūsų el. paštą</p>
            <Button onClick={onClose} className="bg-gold text-[#0B0F17]">Uždaryti</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-[#141B24] border-white/10 text-ivory">
        <DialogHeader>
          <DialogTitle className="text-ivory">
            {step === 1 && 'Pasirinkite datas'}
            {step === 2 && 'Pasirinkite kupolą'}
            {step === 3 && 'Užsakymo santrauka'}
            {step === 4 && 'Apmokėjimas'}
          </DialogTitle>
        </DialogHeader>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`flex-1 h-2 rounded-full ${step >= s ? 'bg-gold' : 'bg-[#0B0F17]'}`} />
          ))}
        </div>

        {/* Step 1: Dates */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#0B0F17]">
              <Label className="block mb-2 text-ivory">Svečių skaičius</Label>
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => setData(d => ({ ...d, guests: Math.max(1, d.guests - 1) }))}>-</Button>
                <span className="text-xl font-bold">{data.guests}</span>
                <Button variant="outline" onClick={() => setData(d => ({ ...d, guests: Math.min(6, d.guests + 1) }))}>+</Button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0B0F17]">
              <Label className="block mb-2 text-ivory">Atvykimas</Label>
              <Input 
                type="date" 
                value={data.checkIn || ''} 
                onChange={(e) => setData(d => ({ ...d, checkIn: e.target.value }))}
                className="bg-[#141B24] border-white/10 text-ivory"
              />
            </div>

            <div className="p-4 rounded-lg bg-[#0B0F17]">
              <Label className="block mb-2 text-ivory">Išvykimas</Label>
              <Input 
                type="date" 
                value={data.checkOut || ''} 
                onChange={(e) => setData(d => ({ ...d, checkOut: e.target.value }))}
                className="bg-[#141B24] border-white/10 text-ivory"
              />
            </div>

            <Button 
              onClick={() => setStep(2)} 
              disabled={!data.checkIn || !data.checkOut}
              className="w-full bg-gold text-[#0B0F17] disabled:opacity-50"
            >
              Toliau <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Accommodation */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-slate">{nights} nakvynės · {data.guests} svečiai</p>
            
            {ACCOMMODATIONS.map((acc) => (
              <Card 
                key={acc.id}
                className={`cursor-pointer transition-all ${data.accommodationId === acc.id ? 'ring-2 ring-gold' : ''} bg-[#0B0F17] border-white/10 hover:bg-[#1a2330]`}
                onClick={() => setData(d => ({ ...d, accommodationId: acc.id }))}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img src={acc.image} alt={acc.name} className="w-24 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-ivory">{acc.name}</h3>
                      <p className="text-gold font-bold">€{acc.price}/naktis</p>
                      <p className="text-sm text-slate">Viso: €{acc.price * nights}</p>
                      <div className="flex gap-1 mt-2">
                        {acc.amenities.map((a, i) => <Badge key={i} variant="outline" className="text-xs">{a}</Badge>)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1"><ChevronLeft className="w-5 h-5 mr-2" /> Atgal</Button>
              <Button onClick={() => setStep(3)} disabled={!data.accommodationId} className="flex-1 bg-gold text-[#0B0F17]">Toliau <ChevronRight className="w-5 h-5 ml-2" /></Button>
            </div>
          </div>
        )}

        {/* Step 3: Summary */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#0B0F17]">
              <p className="text-slate">Datos: {data.checkIn} - {data.checkOut}</p>
              <p className="text-slate">{nights} nakvynės · {data.guests} svečiai</p>
            </div>

            {data.accommodationId && (
              <div className="p-4 rounded-lg bg-[#0B0F17]">
                <p className="text-ivory">{ACCOMMODATIONS.find(a => a.id === data.accommodationId)?.name}</p>
                <p className="text-gold font-bold text-xl">€{total}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1"><ChevronLeft className="w-5 h-5 mr-2" /> Atgal</Button>
              <Button onClick={() => setStep(4)} className="flex-1 bg-gold text-[#0B0F17]"><CreditCard className="w-5 h-5 mr-2" /> Apmokėti</Button>
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gold/10 border border-gold/30">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-ivory">Mokėti:</span>
                <span className="text-2xl font-bold text-gold">€{total}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Input placeholder="Vardas" className="bg-[#0B0F17] border-white/10 text-ivory" />
              <Input placeholder="Pavardė" className="bg-[#0B0F17] border-white/10 text-ivory" />
              <Input type="email" placeholder="El. paštas" className="bg-[#0B0F17] border-white/10 text-ivory" />
              <Input placeholder="Telefonas" className="bg-[#0B0F17] border-white/10 text-ivory" />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(3)} className="flex-1"><ChevronLeft className="w-5 h-5 mr-2" /> Atgal</Button>
              <Button onClick={() => setDone(true)} className="flex-1 bg-gold text-[#0B0F17]"><CreditCard className="w-5 h-5 mr-2" /> Apmokėti €{total}</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingWizard;
