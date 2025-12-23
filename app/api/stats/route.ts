import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetIp } = body;
    const targetUrl = `http://${targetIp}:6000/rpc`;

    const response = await axios.post(targetUrl, {
      jsonrpc: '2.0',
      method: 'get-stats',
      id: 1
    }, { timeout: 2000 });

    return NextResponse.json(response.data.result || {});
  } catch (error) {
    // Demo Mock Stats
    return NextResponse.json({
        metadata: { total_bytes: 1000000000000 },
        file_size: 450000000000,
        stats: {
            cpu_percent: Math.floor(Math.random() * 100),
            ram_used: 8500000000,
            ram_total: 16000000000,
        }
    });
  }
}