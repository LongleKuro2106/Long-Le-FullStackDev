import { useNotification } from '../context/NotificationContext';

const Notification = () => {
  const { notification } = useNotification();
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  };

  return (
    <div style={style}>
      {notification}
    </div>
  );
};

export default Notification;