import { loadStripe } from '@stripe/stripe-js';

// @ts-ignore
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export async function checkoutPro(userId?: string, userEmail?: string, priceId: 'luna_pro_monthly' | 'luna_pro_yearly' = 'luna_pro_monthly') {
  if (!publishableKey) {
    alert("Stripe não configurado: Adicione VITE_STRIPE_PUBLISHABLE_KEY nas definições.");
    return;
  }

  // Basic validation to prevent common mistake of putting secret key in the frontend
  if (publishableKey.startsWith('sk_')) {
    alert("Erro de Configuração: Colocou a 'Secret Key' (sk_...) no campo da 'Publishable Key' (VITE_STRIPE_PUBLISHABLE_KEY). Por favor, use a chave que começa por 'pk_' para o frontend.");
    return;
  }

  try {
    const stripe = await loadStripe(publishableKey);
    if (!stripe) throw new Error("Falha ao carregar o Stripe SDK");

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId,
        userId,
        userEmail
      }),
    });

    const session = await response.json();

    if (session.error) {
      alert(`Erro no Servidor: ${session.error}`);
      return;
    }

    if (session.url) {
      window.location.href = session.url;
    } else if (session.id) {
      // @ts-ignore
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        alert(result.error.message);
      }
    }
  } catch (err: any) {
    console.error("Checkout Error:", err);
    alert("Erro ao processar pagamento. Verifique se as chaves do Stripe estão corretas nas definições.");
  }
}
