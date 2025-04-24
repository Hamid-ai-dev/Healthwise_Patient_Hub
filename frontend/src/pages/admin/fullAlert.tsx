import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FullAlert = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('/api/alerts');
        const data = await response.json();
        setAlerts(data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };
    fetchAlerts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">All Alerts</h1>
      {alerts.map(alert => (
        <Card key={alert._id} className="mb-4">
          <CardHeader>
            <CardTitle>{alert.title}</CardTitle>
            <Badge variant={
              alert.severity === 'high'
                ? 'destructive'
                : alert.severity === 'medium'
                  ? 'outline'
                  : 'default'
            } className="ml-2">
              {alert.severity}
            </Badge>
          </CardHeader>
          <CardContent>
            <p><strong>Description:</strong> {alert.description}</p>
            <p><strong>Time:</strong> {new Date(alert.time).toLocaleString()}</p>
            {alert.details && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold">Details</h3>
                {alert.type === 'contact' && (
                  <div>
                    <p><strong>Name:</strong> {alert.details.name}</p>
                    <p><strong>Email:</strong> {alert.details.email}</p>
                    <p><strong>Subject:</strong> {alert.details.subject}</p>
                    <p><strong>Message:</strong> {alert.details.message}</p>
                  </div>
                )}
                {alert.type === 'system' && alert.details && (
                  <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(alert.details, null, 2)}</pre>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FullAlert;