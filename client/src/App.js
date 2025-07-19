import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';
import KPICard from './components/KPICard';
import './styles/Dashboard.css';

const socket = io('https://real-time-kpi-dashboard.onrender.com');

function App() {
  const [kpiData, setKpiData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('kpiData', (data) => {
      setKpiData(data);
      
      // Update historical data for line chart
      const timestamp = new Date().toLocaleTimeString();
      const newDataPoint = {
        time: timestamp,
        ...data.reduce((acc, kpi) => {
          acc[kpi.name] = kpi.value;
          return acc;
        }, {})
      };
      
      setHistoricalData(prev => [...prev.slice(-19), newDataPoint]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('kpiData');
    };
  }, []);

  const addSampleData = async () => {
    const sampleKPIs = [
      { name: 'Revenue', value: 85000, category: 'Sales', unit: '$', target: 100000 },
      { name: 'Users', value: 2500, category: 'Marketing', unit: '', target: 3000 },
      { name: 'Orders', value: 340, category: 'Sales', unit: '', target: 500 },
      { name: 'Conversion Rate', value: 3.2, category: 'Marketing', unit: '%', target: 5.0 }
    ];

    for (const kpi of sampleKPIs) {
      try {
        await fetch('https://real-time-kpi-dashboard.onrender.com/api/kpis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(kpi)
        });
      } catch (error) {
        console.error('Error adding sample data:', error);
      }
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>📊 Real-time KPI Dashboard</h1>
        <div className="connection-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
        </div>
      </header>

      <div className="dashboard-controls">
        <button onClick={addSampleData} className="sample-data-btn">
          Add Sample Data
        </button>
      </div>

      <div className="kpi-cards">
        {kpiData.map((kpi) => (
          <KPICard key={kpi._id} kpi={kpi} />
        ))}
      </div>

      <div className="charts-container">
        <div className="chart-wrapper">
          <h2>Current KPI Values</h2>
          <BarChart data={kpiData} />
        </div>
        
        <div className="chart-wrapper">
          <h2>Historical Trends</h2>
          <LineChart data={historicalData} />
        </div>
      </div>
    </div>
  );
}

export default App;
