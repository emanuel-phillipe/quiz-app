import React from "react";

function HistoryOption({title, timeNeeded, score, date}) {

  const dateFormatted = () => {
    var minutes = timeNeeded.minutes
    var seconds = timeNeeded.seconds

    if(minutes === 0) return seconds + "s"
    if(seconds === 0) return minutes + "m"
  }

  return (
    <div className="border-zinc-300 backdrop-blur-[2px] border-[1.7px] flex justify-between gap-12 items-center rounded-lg p-3">
      <div>
        <p className="font-semibold text-[1.1rem]">{title}</p>
        <p className="font-normal text-zinc-500 text-[0.9rem]">{dateFormatted()}</p>
      </div>
      <div className="flex flex-col justify-end text-right">
        <p className="text-[1.3rem] font-bold">
          {score}<span className="text-[1rem] font-medium text-zinc-500"> / 10</span>
        </p>
        <p className="text-[0.9rem] text-zinc-500">{date}</p>
      </div>
    </div>
  );
}

export default HistoryOption;
