import React, { useEffect, useState } from 'react'


interface DeadlineTask {
  id: number;
  project_name: string;
  name: string;
  end_date: Date;
}

const DeadlineTimer = ({ endDate }: { endDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(endDate);
      const difference = end.getTime() - now.getTime();

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Первоначальное вычисление
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="deadline__box-timer">
      <p className="timer-day">{timeLeft.days}</p>
      <p>:</p>
      <p className="timer-hours">{timeLeft.hours.toString().padStart(2, '0')}</p>
      <p>:</p>
      <p className="timer-minutes">{timeLeft.minutes.toString().padStart(2, '0')}</p>
      <p>:</p>
      <p className="timer-seconds">{timeLeft.seconds.toString().padStart(2, '0')}</p>
    </div>
  );
};

export default DeadlineTimer