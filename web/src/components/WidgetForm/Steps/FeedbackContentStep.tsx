import { ArrowLeft } from "phosphor-react";
import { FormEvent, useState } from "react";
import { FeedbackType, feedbackTypes } from "..";
import { api } from "../../../lib/api";
import { LoadingMark } from "../../LoadingMark";
import { ScreenshotButton } from "../../ScreenshotButton";
import { WidgetCloseButton } from "../../WidgetCloseButton";

interface FeedbackContentStepProps {
  feedbackType: FeedbackType;
  onClickBackButton: () => void;
  onSubmitFeedback: () => void;
}

export function FeedbackContentStep({ 
  feedbackType, 
  onClickBackButton, 
  onSubmitFeedback,
}: FeedbackContentStepProps) {
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");

  const feedbackTypeInfo = feedbackTypes[feedbackType];

  async function handleSubmitFeedback(event: FormEvent) {
    event.preventDefault();
    setIsSendingFeedback(true);
    
    try {
      await api.post('/feedbacks', {
        type: feedbackType,
        comment,
        screenshot,
      });

      onSubmitFeedback();
    } catch (error) {
      console.log(error);
      setIsSendingFeedback(false);
    }
  }

  return (
    <>
      <header>
        <button 
          className="absolute top-5 left-5 text-zinc-400 hover:text-zinc-100"
          type="button" 
          onClick={onClickBackButton}
        >
          <ArrowLeft weight="bold" className="w-4 h-4"/>
        </button>
        <span className="text-xl leading-6 flex items-center gap-2">
          <img
            className="w-6 h-6"
            src={feedbackTypeInfo.image.source} 
            alt={feedbackTypeInfo.image.alt}
          />
          {feedbackTypeInfo.title}
        </span>

        <WidgetCloseButton />
      </header>
      <form className="my-4 w-full" onSubmit={handleSubmitFeedback}>
        <textarea 
          className="min-w-[304px] w-full min-h-[112px] text-sm placeholder-zinc-400 text-zinc-100 border-zinc-600 bg-transparent rounded-md focus:border-brand-500 focus:ring-brand-500 focus:ring-1 focus:outline-none resize-none scrollbar-thumb-zinc-700 scrollbar-track-transparent scrollbar-thin"
          placeholder="Conte com detalhes o que está acontecendo..."
          onChange={(e) => setComment(e.target.value)}
          disabled={isSendingFeedback}
        />

        <footer className="flex gap-2 mt-2">
          <ScreenshotButton 
            preview={screenshot}
            onScreenshot={setScreenshot}
            disabled={isSendingFeedback}
          />

          <button
            className="p-2 bg-brand-500 rounded-md border-transparent flex-1 flex justify-center items-center text-sm hover:bg-brand-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-brand-500 transition-colors disabled:opacity-50 disabled:hover:bg-brand-500"
            type="submit"
            disabled={comment.length === 0 || isSendingFeedback}
          >
            { isSendingFeedback ? <LoadingMark /> : "Enviar Feedback" }
          </button>
        </footer>
      </form>
    </>
  );
}
