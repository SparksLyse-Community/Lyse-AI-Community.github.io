import { useEffect, useRef, useState } from "react";
import { 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  Terminal, 
  Clock, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Play,
  Pause,
  Layers,
  TrendingDown,
  Activity,
  Hourglass
} from "lucide-react";
import Button from "./ui/Button";

interface TrainingDashboardProps {
  imageUrl?: string;
  alt?: string;
}

interface TrainingStatus {
  timestamp: number;
  type: string;
  epoch: string;
  completion: string;
  loss: number;
  tps: string;
  eta: string;
}

export default function TrainingDashboard({ alt = "Training Status" }: TrainingDashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timestamp, setTimestamp] = useState<number>(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(30); // in seconds
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState<number>(30);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [statusData, setStatusData] = useState<TrainingStatus | null>(null);
  const [historyData, setHistoryData] = useState<TrainingStatus[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [dataError, setDataError] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "[INIT] Connexion au pipeline d'entraînement SparksLyse (status.json)...",
    "[FETCH] Récupération des données en cours..."
  ]);

  const fetchTrainingStatus = async () => {
    setApiLoading(true);
    setDataError(false);
    try {
      const res = await fetch("https://marvideo.fr/lyseai-api/status.json", { mode: 'cors' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setHistoryData(data);
          const latest = data[data.length - 1];
          setStatusData(latest);
          
          const nowStr = new Date().toTimeString().split(' ')[0];
          setLogs(prev => [
            ...prev,
            `[${nowStr}] [SYNC] Phase: ${latest.type} | Tokens: ${latest.epoch} | Loss: ${latest.loss} | TPS: ${latest.tps} | ETA: ${latest.eta}`
          ]);
        } else {
          setDataError(true);
          setHistoryData([]);
          setStatusData(null);
        }
      } else {
        setDataError(true);
        setHistoryData([]);
        setStatusData(null);
      }
    } catch (err) {
      console.error("API fetch failed (CORS or network error):", err);
      setDataError(true);
      setHistoryData([]);
      setStatusData(null);
      const nowStr = new Date().toTimeString().split(' ')[0];
      setLogs(prev => [
        ...prev,
        `[${nowStr}] [ERROR] Impossible de joindre l'API (CORS / Réseau).`
      ]);
    } finally {
      setApiLoading(false);
      setTimestamp(Date.now());
    }
  };

  useEffect(() => {
    fetchTrainingStatus();
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          triggerRefresh();
          return refreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshInterval, isPaused]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen?.().catch((err) => {
        console.error("Error attempting to exit fullscreen:", err);
      });
    }
  };

  const triggerRefresh = () => {
    setIsRefreshing(true);
    fetchTrainingStatus();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
    setCountdown(refreshInterval);
  };

  const handleManualRefresh = () => {
    triggerRefresh();
  };

  // Compute SVG sparkline points for loss curve filling the width/height
  const losses = historyData.map(d => Number(d.loss) || 0);
  const minLoss = losses.length > 0 ? Math.min(...losses) : 0;
  const maxLoss = losses.length > 0 ? Math.max(...losses) : 1;
  const lossRange = maxLoss - minLoss || 1;

  const width = 1000;
  const height = 280;
  const padding = 0;

  const points = losses.map((loss, i) => {
    const x = padding + (i / (losses.length > 1 ? losses.length - 1 : 1)) * (width - 2 * padding);
    const y = height - padding - ((loss - minLoss) / lossRange) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div 
      ref={containerRef}
      className={`w-full font-sans transition-all duration-300 ${isFullscreen ? "bg-[#0a0a0a] p-4 sm:p-8 overflow-y-auto flex flex-col h-screen" : ""}`}
    >
      {/* Dashboard Top Bar & Controls */}
      <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/75 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </div>
          <div>
            <h2 className="text-xl font-normal text-white flex items-center gap-3">
              SparksLyse-v1
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/20">
                {statusData ? statusData.type : (dataError ? "Erreur API" : "Actif")}
              </span>
            </h2>
            <p className="text-sm text-white/45 mt-1">
              Télémétrie en direct via API (status.json)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Interval Selector */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white/60">
            <Clock className="w-3.5 h-3.5 opacity-50" />
            <select 
              value={refreshInterval}
              onChange={(e) => {
                const val = Number(e.target.value);
                setRefreshInterval(val);
                setCountdown(val);
              }}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value={15} className="bg-[#141414]">15s</option>
              <option value={30} className="bg-[#141414]">30s</option>
              <option value={60} className="bg-[#141414]">1m</option>
            </select>
          </div>

          {/* Pause / Resume Auto-refresh */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
              isPaused 
                ? "bg-white/20 border-white/40 text-white" 
                : "bg-white/5 border-white/10 text-white/60 hover:text-white"
            }`}
            title={isPaused ? "Reprendre" : "Pause"}
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
          </button>

          {/* Manual Refresh Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing || apiLoading}
            className="!min-h-10 px-5 bg-white text-black border-0 hover:opacity-90 font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isRefreshing || apiLoading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col gap-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <MetricBox 
            label="Loss (Perte)" 
            value={statusData ? statusData.loss.toString() : "—"} 
            icon={<TrendingDown className="w-4 h-4" />}
            sub={statusData ? `Phase: ${statusData.type}` : (dataError ? "Erreur de chargement API" : "En attente...")}
          />
          <MetricBox 
            label="Progression" 
            value={statusData ? statusData.completion : "—"} 
            icon={<Activity className="w-4 h-4" />}
            sub={statusData ? statusData.epoch : (dataError ? "Vérifiez CORS / Serveur" : "En attente...")}
          />
          <MetricBox 
            label="Vitesse" 
            value={statusData ? `${statusData.tps} t/s` : "—"} 
            icon={<Zap className="w-4 h-4" />}
            sub="Tokens par seconde"
          />
          <MetricBox 
            label="Estimation" 
            value={statusData ? statusData.eta : "—"} 
            icon={<Hourglass className="w-4 h-4" />}
            sub="Temps restant estimé"
          />
        </div>

        {/* Live Loss Curve Chart */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/45 font-medium">Évolution de la Perte (Loss) — Données API</span>
            <span className="text-[10px] text-white/40">{historyData.length} points enregistrés</span>
          </div>
          
          <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/2.5 backdrop-blur-sm pt-8 pb-4 px-0 flex flex-col items-center justify-center min-h-[280px]">
            {apiLoading && losses.length === 0 ? (
              <div className="flex flex-col items-center text-center gap-4 py-12">
                <RefreshCw className="w-6 h-6 text-white/40 animate-spin" />
                <p className="text-xs text-white/40">Chargement des données depuis l'API...</p>
              </div>
            ) : dataError || losses.length === 0 ? (
              <div className="flex flex-col items-center text-center gap-4 py-12 px-4 max-w-md">
                <AlertCircle className="w-8 h-8 text-amber-400/80" />
                <div>
                  <p className="text-sm font-medium text-white mb-1">Impossible de charger les données depuis l'API</p>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Le serveur distant n'a pas renvoyé de données ou bloque la requête (CORS).
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-64 overflow-visible">
                  {/* Grid lines */}
                  <line x1={0} y1={0} x2={width} y2={0} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                  <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                  <line x1={0} y1={height} x2={width} y2={height} stroke="rgba(255,255,255,0.1)" />

                  {/* Gradient fill under curve */}
                  <defs>
                    <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255, 255, 255, 0.15)" />
                      <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                    </linearGradient>
                  </defs>
                  
                  {losses.length > 1 && (
                    <>
                      <polygon 
                        points={`0,${height} ${points} ${width},${height}`} 
                        fill="url(#lossGradient)" 
                      />
                      <polyline
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points}
                      />
                    </>
                  )}
                </svg>
                <div className="w-full flex items-center justify-between text-[10px] text-white/40 mt-4 px-6">
                  <span>Min Loss: {minLoss.toFixed(4)}</span>
                  <span>Dernière valeur: {losses[losses.length - 1]?.toFixed(4) || "—"}</span>
                  <span>Max Loss: {maxLoss.toFixed(4)}</span>
                </div>
              </div>
            )}
            
            {/* Overlay info */}
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between pointer-events-none">
              <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[9px] uppercase tracking-widest text-white/60">
                API Live Feed • {new Date(timestamp).toLocaleTimeString()}
              </div>
              {isRefreshing && (
                <div className="px-3 py-1.5 rounded-full bg-white text-black text-[9px] uppercase tracking-widest font-bold">
                  Synchronisation
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricBox({ label, value, icon, sub }: { label: string, value: string, icon: React.ReactNode, sub: string }) {
  return (
    <div className="p-5 rounded-xl border border-white/10 bg-white/5 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <span className="text-[10px] uppercase tracking-wider text-white/40">{label}</span>
        <span className="text-white/40">{icon}</span>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-light text-white">{value}</div>
        <div className="text-[10px] text-white/30 mt-1">{sub}</div>
      </div>
    </div>
  );
}
