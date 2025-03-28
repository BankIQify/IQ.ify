
interface KeyboardShortcutsHelpProps {
  isLastQuestion: boolean;
  reviewMode: boolean;
}

const KeyboardShortcutsHelp = ({ isLastQuestion, reviewMode }: KeyboardShortcutsHelpProps) => {
  return (
    <div className="text-xs text-gray-500 text-center mt-4">
      <p>
        Keyboard shortcuts: <span className="bg-gray-100 px-1 rounded">←</span> Previous | <span className="bg-gray-100 px-1 rounded">→</span> Next 
        {!reviewMode && isLastQuestion && ' | '} 
        {!reviewMode && isLastQuestion && <span className="bg-gray-100 px-1 rounded">Ctrl+Enter</span>}
        {!reviewMode && isLastQuestion && ' Submit'}
      </p>
    </div>
  );
};

export default KeyboardShortcutsHelp;
