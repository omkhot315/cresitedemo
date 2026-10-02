import {
  Stethoscope, Hospital, Smile, Scissors, Dumbbell,
  Flame, Coffee, UtensilsCrossed, BedDouble, Croissant,
  GraduationCap, Briefcase, Building2, Camera, Plane,
  Car, Flower2, HeartPulse, Sparkles, Laptop,
  Store, ShieldCheck, ScanLine, Wallet, Sun,
  Baby, Activity, Salad, Users, ShowerHead,
  Target, UserCheck, Headset, BadgeCheck, Settings,
  TrendingUp, Leaf, Wand2, Crown, Palette,
  Martini, KeyRound, PawPrint, Wifi, Zap,
  Clock, Gem, Hand, Music, BookOpen,
  Award, ThumbsUp, Sofa, Calculator, PencilRuler,
  Fan, SprayCan, WashingMachine, ChefHat, Paintbrush,
  Diamond, PartyPopper, Broom, Droplets, Ruler,
  Lamp, Thermometer, Wind, Carrot, Brush,
  Scale, Home, Hammer, Bike, Truck,
  Package, Bug, Map, Tent, Flower,
  Candy, Eye, Pill, Languages, Megaphone,
  Printer, Video, Clapperboard, AtSign, HardHat,
  Armchair, Bath, Sprout, GlassWater, PenTool,
  Refrigerator, Dog, Cat, Monitor, PanelTop,
  Smartphone, Wrench, Sandwich,
} from "lucide-react";

/** String -> icon map so business DATA can reference icons by name. */
const ICONS = {
  Stethoscope, Hospital, Smile, Scissors, Dumbbell,
  Flame, Coffee, UtensilsCrossed, BedDouble, Croissant,
  GraduationCap, Briefcase, Building2, Camera, Plane,
  Car, Flower2, HeartPulse, Sparkles, Laptop,
  Store, ShieldCheck, ScanLine, Wallet, Sun,
  Baby, Activity, Salad, Users, ShowerHead,
  Target, UserCheck, Headset, BadgeCheck, Settings,
  TrendingUp, Leaf, Wand2, Crown, Palette,
  Martini, KeyRound, PawPrint, Wifi, Zap,
  Clock, Gem, Hand, Music, BookOpen,
  Award, ThumbsUp, Sofa, Calculator, PencilRuler,
  Fan, SprayCan, WashingMachine, ChefHat, Paintbrush,
  Diamond, PartyPopper, Broom, Droplets, Ruler,
  Lamp, Thermometer, Wind, Carrot, Brush,
  Scale, Home, Hammer, Bike, Truck,
  Package, Bug, Map, Tent, Flower,
  Candy, Eye, Pill, Languages, Megaphone,
  Printer, Video, Clapperboard, AtSign, HardHat,
  Armchair, Bath, Sprout, GlassWater, PenTool,
  Refrigerator, Dog, Cat, Monitor, PanelTop,
  Smartphone, Wrench, Sandwich,
};

export const ICON_CHOICES = Object.keys(ICONS);

export default function BizIcon({ name, size = 18, ...rest }) {
  const Cmp = ICONS[name] || Sparkles;
  return <Cmp size={size} {...rest} />;
}
