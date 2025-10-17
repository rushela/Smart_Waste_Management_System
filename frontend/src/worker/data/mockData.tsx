import React from 'react';
// Mock data for the Eco AI Waste Manager app
// Routes
export const routes = [{
  id: 'R001',
  name: 'Downtown North',
  address: 'North Main St Area',
  bins: [{
    id: 'BIN001',
    status: 'pending',
    type: 'recycling',
    address: '123 North Main St'
  }, {
    id: 'BIN002',
    status: 'pending',
    type: 'general',
    address: '145 North Main St'
  }, {
    id: 'BIN003',
    status: 'completed',
    type: 'compost',
    address: '167 North Main St'
  }, {
    id: 'BIN004',
    status: 'pending',
    type: 'recycling',
    address: '189 North Main St'
  }]
}, {
  id: 'R002',
  name: 'Westside Commercial',
  address: 'West Business District',
  bins: [{
    id: 'BIN005',
    status: 'pending',
    type: 'general',
    address: '45 Commerce Ave'
  }, {
    id: 'BIN006',
    status: 'pending',
    type: 'recycling',
    address: '67 Commerce Ave'
  }, {
    id: 'BIN007',
    status: 'pending',
    type: 'compost',
    address: '89 Commerce Ave'
  }]
}, {
  id: 'R003',
  name: 'Eastside Residential',
  address: 'East Housing Area',
  bins: [{
    id: 'BIN008',
    status: 'pending',
    type: 'general',
    address: '22 Oak Street'
  }, {
    id: 'BIN009',
    status: 'pending',
    type: 'recycling',
    address: '24 Oak Street'
  }, {
    id: 'BIN010',
    status: 'pending',
    type: 'compost',
    address: '26 Oak Street'
  }, {
    id: 'BIN011',
    status: 'pending',
    type: 'general',
    address: '28 Oak Street'
  }, {
    id: 'BIN012',
    status: 'pending',
    type: 'recycling',
    address: '30 Oak Street'
  }]
}];
// Residents
export const residents = [{
  id: 'RES001',
  name: 'Alice Cooper',
  address: '123 North Main St',
  phone: '555-123-4567',
  binId: 'BIN001',
  notes: 'Prefers collection before 10am'
}, {
  id: 'RES002',
  name: 'Bob Dylan',
  address: '145 North Main St',
  phone: '555-234-5678',
  binId: 'BIN002',
  notes: 'Has additional recycling on Tuesdays'
}, {
  id: 'RES003',
  name: 'Charlie Parker',
  address: '167 North Main St',
  phone: '555-345-6789',
  binId: 'BIN003',
  notes: 'New compost bin installed last month'
}, {
  id: 'RES004',
  name: 'David Bowie',
  address: '189 North Main St',
  phone: '555-456-7890',
  binId: 'BIN004',
  notes: ''
}, {
  id: 'RES005',
  name: 'Westside Mall',
  address: '45 Commerce Ave',
  phone: '555-567-8901',
  binId: 'BIN005',
  notes: 'Commercial account - multiple bins'
}, {
  id: 'RES006',
  name: 'Tech Office Park',
  address: '67 Commerce Ave',
  phone: '555-678-9012',
  binId: 'BIN006',
  notes: 'High volume of paper recycling'
}, {
  id: 'RES007',
  name: 'Green Restaurant',
  address: '89 Commerce Ave',
  phone: '555-789-0123',
  binId: 'BIN007',
  notes: 'Compost collected daily'
}, {
  id: 'RES008',
  name: 'Emily Davis',
  address: '22 Oak Street',
  phone: '555-890-1234',
  binId: 'BIN008',
  notes: ''
}, {
  id: 'RES009',
  name: 'Frank Sinatra',
  address: '24 Oak Street',
  phone: '555-901-2345',
  binId: 'BIN009',
  notes: 'Elderly resident - bin placed near driveway'
}, {
  id: 'RES010',
  name: 'Grace Kelly',
  address: '26 Oak Street',
  phone: '555-012-3456',
  binId: 'BIN010',
  notes: ''
}, {
  id: 'RES011',
  name: 'Henry Ford',
  address: '28 Oak Street',
  phone: '555-123-4567',
  binId: 'BIN011',
  notes: 'Has requested text notifications'
}, {
  id: 'RES012',
  name: 'Irene Adler',
  address: '30 Oak Street',
  phone: '555-234-5678',
  binId: 'BIN012',
  notes: 'New resident as of last month'
}];
// Collection History
export const collectionHistory = [{
  id: 'COL001',
  binId: 'BIN003',
  timestamp: '2023-06-15T09:23:12',
  wasteType: 'compost',
  weight: 12.5,
  fillLevel: 85,
  contamination: false,
  notes: 'Regular collection',
  workerId: 'W001'
}, {
  id: 'COL002',
  binId: 'BIN001',
  timestamp: '2023-06-14T10:45:33',
  wasteType: 'recycling',
  weight: 8.3,
  fillLevel: 70,
  contamination: true,
  contaminationDetails: 'Plastic bags mixed with paper',
  notes: 'Resident notified about contamination',
  workerId: 'W001'
}, {
  id: 'COL003',
  binId: 'BIN005',
  timestamp: '2023-06-14T13:12:45',
  wasteType: 'general',
  weight: 22.7,
  fillLevel: 90,
  contamination: false,
  notes: 'Commercial account - high volume',
  workerId: 'W002'
}, {
  id: 'COL004',
  binId: 'BIN006',
  timestamp: '2023-06-14T13:45:22',
  wasteType: 'recycling',
  weight: 15.2,
  fillLevel: 65,
  contamination: false,
  notes: '',
  workerId: 'W002'
}, {
  id: 'COL005',
  binId: 'BIN007',
  timestamp: '2023-06-14T14:05:11',
  wasteType: 'compost',
  weight: 18.9,
  fillLevel: 75,
  contamination: false,
  notes: 'Restaurant compost - food waste only',
  workerId: 'W002'
}];
// Waste Types
export const wasteTypes = [{
  id: 'general',
  name: 'General Waste',
  color: 'bg-gray-500'
}, {
  id: 'recycling',
  name: 'Recycling',
  color: 'bg-blue-500'
}, {
  id: 'compost',
  name: 'Compost',
  color: 'bg-green-500'
}, {
  id: 'paper',
  name: 'Paper',
  color: 'bg-yellow-500'
}, {
  id: 'glass',
  name: 'Glass',
  color: 'bg-purple-500'
}, {
  id: 'electronic',
  name: 'Electronic',
  color: 'bg-red-500'
}];
// Get resident by bin ID
export const getResidentByBinId = (binId: string) => {
  return residents.find(resident => resident.binId === binId) || null;
};
// Get bin details
export const getBinById = (binId: string) => {
  for (const route of routes) {
    const bin = route.bins.find(bin => bin.id === binId);
    if (bin) return {
      ...bin,
      routeId: route.id,
      routeName: route.name
    };
  }
  return null;
};
// Get collection history for a bin
export const getCollectionHistoryForBin = (binId: string) => {
  return collectionHistory.filter(record => record.binId === binId);
};