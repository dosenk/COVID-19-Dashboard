import './styles/index.scss';
import App from './App/index.App';

document.body.onload = async () => {
  const app = new App();
  app.start();
};
