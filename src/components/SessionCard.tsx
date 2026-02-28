import { Session } from "@/types/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star, Calendar, CurrencyDollar as PoundSterling } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

interface SessionCardProps extends Session { }

export function SessionCard(session: SessionCardProps) {
  const {
    id,
    title,
    description,
    mentor,
    duration,
    price,
    category,
    level,
    enrolled,
    maxCapacity,
    sessionType,
    availableSlots
  } = session;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-2 border-gray-100 hover:border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="secondary" className="bg-slate-100 text-slate-700">
            {category}
          </Badge>
          <Badge variant="outline" className={`
            ${level === 'Beginner' ? 'border-green-200 text-green-700 bg-green-50' : ''}
            ${level === 'Intermediate' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' : ''}
            ${level === 'Advanced' ? 'border-red-200 text-red-700 bg-red-50' : ''}
          `}>
            {level}
          </Badge>
        </div>

        <CardTitle className="text-xl leading-tight hover:text-slate-700 transition-colors">
          <Link to={`/sessions/${id}`}>
            {title}
          </Link>
        </CardTitle>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Mentor Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-gray-500 text-white text-sm font-semibold">
            {mentor.avatar}
          </div>
          <div>
            <p className="font-semibold text-sm">{mentor.name}</p>
            <p className="text-xs text-gray-600">{mentor.title} at {mentor.company}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-600">{mentor.rating}</span>
            </div>
          </div>
        </div>

        {/* Session Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{duration} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{enrolled}/{maxCapacity}</span>
          </div>
          <div className="flex items-center gap-2">
            <PoundSterling className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 font-semibold">${price}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 capitalize">{sessionType}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1">
          {session.skills.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-gray-50">
              {skill}
            </Badge>
          ))}
        </div>

        {/* Available Slots Info */}
        <div className="text-xs text-gray-600">
          {availableSlots.length} available slots starting {availableSlots[0]?.date}
        </div>

        {/* Action Button */}
        <Button className="w-full" asChild>
          <Link to={`/sessions/${id}`}>
            View Details & Book
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
