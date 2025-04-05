export async function GET() {
  try {
    const response = await fetch('https://a8d1-103-207-59-158.ngrok-free.app/expenses/', {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API response error: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching expenses data:', error);
    return Response.json(
      { error: 'Failed to fetch expenses data. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch('https://a8d1-103-207-59-158.ngrok-free.app/expenses/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API response error: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error creating expense:', error);
    return Response.json(
      { error: 'Failed to create expense. Please try again later.' },
      { status: 500 }
    );
  }
}
