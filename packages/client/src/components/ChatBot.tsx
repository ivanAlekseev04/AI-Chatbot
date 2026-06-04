import { Button } from './ui/button';
import { FaArrowCircleUp } from 'react-icons/fa';

const ChatBot = () => {
    return (
        <div className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl">
            <textarea
                className="w-full border-0 focus:outline-0 resize-none"
                placeholder="Ask anything"
                maxLength={1000}
            />
            <Button className="rounded-full w-9 h-9">
                {/* We are giving fixed length/width to the Button since only the square can be made a perfect circle */}
                <FaArrowCircleUp />
            </Button>
        </div>
    );
};

export default ChatBot;
