import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const About = () => {
  const stats = [
    { number: "10K+", label: "Happy Clients" },
    { number: "5K+", label: "Properties Sold" },
    { number: "14+", label: "Years Experience" },
    { number: "50+", label: "Awards Won" },
  ];

  return (
    <section className="pb-10">
      <div className="hidden sm:block h-12 bg-[#222]"></div>
      <div className="container pt-10">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4 font-manrope">
            Established 2010
          </Badge>
          <h1 className="text-2xl uppercase font-extrabold mb-6">
            Our Journey So Far
          </h1>
          <p className="mb-8 leading-relaxed">
            Your trusted partner in real estate for over a decade. We connect
            dreams with reality, helping thousands of families find their
            perfect home and investors discover lucrative opportunities.
          </p>

          {/* Stats */}
          <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-cente border py-4 rounded">
                <div className="md:text-3xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section */}

        <div className="grid  md:grid-cols-2 gap-12 items-center py-20">
          <div>
            <Badge variant="outline" className="mb-4">
              Our Story
            </Badge>
            <h2 className="text-[22px] font-bold mb-6">
              Building Dreams Since 2010
            </h2>
            <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
              <p>
                What started as a small family business has grown into one of
                the region's most trusted real estate companies. Founded by
                Elvis O. with a simple mission: to make the complex world of
                real estate accessible to everyone.
              </p>
              <p>
                Over the years, we've witnessed neighborhoods transform,
                families grow, and investors prosper. Our deep understanding of
                local markets, combined with cutting-edge technology, ensures
                our clients always stay ahead of the curve.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
                alt="Modern real estate office"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 right-6 w-fit md:-left-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg">
              <div className="text-2xl font-bold">14+</div>
              <div className="text-sm opacity-90">Years of Excellence</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container">
        <Card className="text-center gap-0 py-12 bg-card/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="">
            <Badge variant="secondary" className="mb-4 mx-auto w-fit">
              Our Mission
            </Badge>
            <CardTitle className="text-[22px] font-bold mb-2">
              Modernizing Real Estate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-[15px] leading-relaxed mb-8">
              Our mission is to revolutionize the real estate industry by
              combining traditional expertise with innovative technology. We're
              committed to making property transactions transparent, efficient,
              and stress-free for every client.
            </CardDescription>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 rounded-xl bg-primary/5 border">
                <div className="text-xl font-bold text-primary mb-2">
                  Client-First
                </div>
                <div className="text-sm text-muted-foreground">
                  Every decision prioritizes our clients' best interests
                </div>
              </div>
              <div className="p-6 rounded-xl bg-accent/5 border">
                <div className="text-xl font-bold text-accent mb-2">
                  Innovation
                </div>
                <div className="text-sm text-muted-foreground">
                  Embracing technology to enhance every experience
                </div>
              </div>
              <div className="p-6 rounded-xl bg-secondary/20 border">
                <div className="text-xl font-bold text-secondary-foreground mb-2">
                  Community
                </div>
                <div className="text-sm text-muted-foreground">
                  Building stronger communities through real estate
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact CTA Section */}
      <div className="container my-20">
        <Card className="max-w-2xl mx-auto text-center bg-linear-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-[22px] font-bold">Start Here</CardTitle>
            <CardDescription className="text-[15px]">
              Buy. Sell. Invest. We’ll guide you every step of the way.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="uppercase"> Get Started Today</Button>
              <Button variant="outline" className="uppercase">
                Schedule Consultation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default About;
