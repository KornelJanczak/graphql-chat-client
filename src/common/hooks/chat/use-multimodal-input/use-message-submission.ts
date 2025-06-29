"use client";

interface AddMessageOptions {
  variables: {
    addMessageInput: {
      chatId: number;
      content: string;
    };
  };
}

interface UseMessageSubmissionProps {
  chatId: string;
  addMessage: (options: AddMessageOptions) => Promise<any>;
}

export const useMessageSubmission = ({
  chatId,
  addMessage,
}: UseMessageSubmissionProps) => {
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    await addMessage({
      variables: {
        addMessageInput: {
          chatId: parseInt(chatId),
          content,
        },
      },
    });

    return true;
  };

  return { sendMessage };
};
