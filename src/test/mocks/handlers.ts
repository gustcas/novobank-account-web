import { http, HttpResponse } from "msw";

const user = {
  id: "user-1",
  email: "usuario@novobanco.com",
  fullName: "Juan Perez",
  customerId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
};

const accounts = [
  {
    id: "acc-1",
    accountNumber: "1234567890123456",
    type: "SAVINGS",
    balance: 2500.45,
    currency: "USD",
    status: "ACTIVE",
    customerId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    createdAt: "2026-04-18T14:35:00.000Z"
  },
  {
    id: "acc-2",
    accountNumber: "1111222233334444",
    type: "CHECKING",
    balance: 980.1,
    currency: "USD",
    status: "BLOCKED",
    customerId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    createdAt: "2026-04-18T14:35:00.000Z"
  }
];

const transactions = {
  content: [
    {
      id: "tx-1",
      reference: "DEP-001",
      accountId: "acc-1",
      type: "DEPOSIT",
      amount: 300,
      status: "SUCCESS",
      createdAt: "2026-04-18T14:35:00.000Z"
    }
  ],
  page: 0,
  totalPages: 1,
  totalElements: 1,
  size: 10,
  last: true
};

export const handlers = [
  http.post("http://localhost:8081/api/v1/auth/register", async ({ request }) => {
    const body = (await request.json()) as {
      email: string;
      password: string;
      fullName: string;
      customerId: string;
    };

    if (!body.email || !body.password || !body.fullName || !body.customerId) {
      return HttpResponse.json({ detail: "Datos de registro incompletos." }, { status: 422 });
    }

    return HttpResponse.json({
      accessToken: "register-access-token",
      refreshToken: "register-refresh-token",
      expiresIn: 300,
      user: {
        id: "user-2",
        email: body.email,
        fullName: body.fullName,
        customerId: body.customerId
      }
    });
  }),
  http.post("http://localhost:8081/api/v1/auth/login", async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    if (body.password !== "Password123!") {
      return HttpResponse.json({ detail: "Credenciales invalidas." }, { status: 401 });
    }

    return HttpResponse.json({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      expiresIn: 300,
      user
    });
  }),
  http.post("http://localhost:8081/api/v1/auth/refresh", () =>
    HttpResponse.json({
      accessToken: "refreshed-token",
      expiresIn: 300
    })
  ),
  http.post("http://localhost:8081/api/v1/auth/logout", () => new HttpResponse(null, { status: 204 })),
  http.get("http://localhost:8081/api/v1/auth/me", () => HttpResponse.json(user)),
  http.get("http://localhost:8080/api/v1/accounts", ({ request }) => {
    const customerId = new URL(request.url).searchParams.get("customerId");

    if (!customerId) {
      return HttpResponse.json({ detail: "customerId es obligatorio." }, { status: 400 });
    }

    return HttpResponse.json(accounts.filter((account) => account.customerId === customerId));
  }),
  http.get("http://localhost:8080/api/v1/accounts/:id", ({ params }) => {
    const account = accounts.find((item) => item.id === params.id);
    return account ? HttpResponse.json(account) : HttpResponse.json({ detail: "Cuenta no encontrada." }, { status: 404 });
  }),
  http.post("http://localhost:8080/api/v1/accounts", async ({ request }) => {
    const payload = (await request.json()) as { customerId: string; type: string };

    return HttpResponse.json(
      {
        id: "acc-3",
        accountNumber: "9999888877776666",
        customerId: payload.customerId,
        type: payload.type,
        currency: "USD",
        balance: 0,
        status: "ACTIVE"
      }
    );
  }),
  http.get("http://localhost:8080/api/v1/accounts/:id/transactions", () => HttpResponse.json(transactions)),
  http.post("http://localhost:8080/api/v1/accounts/:id/transactions/deposits", async ({ request }) => {
    const body = (await request.json()) as { amount: number };

    if (body.amount <= 0) {
      return HttpResponse.json({ detail: "Monto invalido." }, { status: 422 });
    }

    return HttpResponse.json({ id: "dep-1", reference: "DEP-NEW", status: "SUCCESS" });
  }),
  http.post("http://localhost:8080/api/v1/accounts/:id/transactions/withdrawals", async ({ request }) => {
    const body = (await request.json()) as { amount: number };

    if (body.amount > 2500.45) {
      return HttpResponse.json({ detail: "Saldo insuficiente." }, { status: 422 });
    }

    return HttpResponse.json({ id: "wit-1", reference: "WIT-NEW", status: "SUCCESS" });
  }),
  http.post("http://localhost:8080/api/v1/accounts/:id/transactions/transfers", () =>
    HttpResponse.json([{ id: "trf-1", reference: "TRF-NEW", status: "SUCCESS" }])
  )
];
