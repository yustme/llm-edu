import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { modules } from "@/data/modules";
import { APP_TITLE } from "@/config/app.config";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="p-8">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">{APP_TITLE}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Interactive educational modules explaining AI agents, multi-agent
          systems, the Model Context Protocol, and semantic layers in the data
          world.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-4xl">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {module.id}. {module.name}
                    </CardTitle>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <Badge variant="secondary">
                  {module.stepCount} steps
                </Badge>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to={module.path}>
                    Start
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
