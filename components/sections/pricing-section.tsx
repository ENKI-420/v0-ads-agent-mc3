import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function PricingSection() {
  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "per month",
      features: [
        "Basic AI Chat Assistant",
        "Limited Collaboration Tools",
        "Standard Support",
        "5GB Storage",
        "Up to 3 Users",
      ],
      buttonText: "Start Free Trial",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$99",
      period: "per month",
      features: [
        "Advanced AI Assistant",
        "Real-time Collaboration",
        "Priority Support",
        "50GB Storage",
        "Up to 10 Users",
        "Basic System Metrics",
      ],
      buttonText: "Get Started",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: [
        "Full AI Orchestration",
        "Dedicated Support Manager",
        "Unlimited Storage",
        "Unlimited Users",
        "Advanced Analytics & Reporting",
        "Custom Integrations",
      ],
      buttonText: "Contact Sales",
      highlight: false,
    },
  ]

  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Flexible Pricing for Every Business</h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
          Choose the plan that best fits your team's needs and scale as you grow.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col ${
                plan.highlight ? "border-2 border-primary shadow-lg" : "border border-border"
              }`}
            >
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-4xl font-extrabold mt-2">
                  {plan.price}
                  {plan.period && <span className="text-lg font-medium text-muted-foreground"> {plan.period}</span>}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 px-6 py-4">
                <ul className="space-y-3 text-left">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-muted-foreground">
                      <Check className="mr-2 h-5 w-5 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button className="w-full" variant={plan.highlight ? "default" : "outline"}>
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
