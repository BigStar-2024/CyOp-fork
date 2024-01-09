import useTyped from 'hooks/typed';

const sndCmd = require('assets/audio/command.mp3').default;

interface ICommandPanel {
  cmd: string;
  onComplete?: () => void;
}

export const CommandPanel = ({ cmd, onComplete }: ICommandPanel) => {
  const onCompleteAnimation = () => {
    if (onComplete) onComplete();
  };

  const [aniCmdText, cmdCompleted] = useTyped({
    text: cmd,
    start: true,
    speed: 20,
    soundFile: sndCmd,
    onComplete: onCompleteAnimation,
  });

  return (
    <div className="co-cmd-panel d-flex align-items-center">
      <span>{aniCmdText}</span>
      {!cmdCompleted && <div className="text-caret"></div>}
    </div>
  );
};

export default CommandPanel;
