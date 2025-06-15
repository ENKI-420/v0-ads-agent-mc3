"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Shield, Users } from "lucide-react"

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "$99",
      period: "per month",
      description: "Perfect for small teams getting started with AI collaboration",
      icon: <Users className="h-6 w-6" />,
      features: [
        "Up to 10 team members",
        "Basic AI chat assistant",
        "5GB document storage",
        "Standard video conferencing",
        "Email support",
        "Basic analytics",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$299",
      period: "per month",
      description: "Advanced features for growing organizations",
      icon: <Zap className="h-6 w-6" />,
      features: [
        "Up to 50 team members",
        "Advanced AI orchestration",
        "50GB document storage",
        "HD video conferencing",
        "Priority support",
        "Advanced analytics",
        "Custom integrations",
        "API access",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "Enterprise-grade security and unlimited scale",
      icon: <Shield className="h-6 w-6" />,
      features: [
        "Unlimited team members",
        "Multi-agent AI orchestration",
        "Unlimited storage",
        "4K video conferencing",
        "24/7 dedicated support",
        "Custom analytics",
        "White-label options",
        "On-premise deployment",
        "SOC 2 compliance",
        "HIPAA compliance",
      ],
      popular: false,
    },
  ]

  return (
    <section className="py-24">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Pricing Plans
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Choose Your Plan</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Flexible pricing options designed to scale with your organization's needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">Most Popular</Badge>
              )}

              <CardHeader className="text-center pb-8">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${plan.popular ? "bg-primary" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            All plans include 14-day free trial • No setup fees • Cancel anytime
          </p>
          <Button variant="link">View detailed feature comparison →</Button>
        </div>
      </div>
    </section>
  )
}
