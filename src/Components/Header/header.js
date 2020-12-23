import {
  HEADER_CLASS, HEADER_WRAPPER_CLASS, HEADER_LOGO_CLASS, HEADER_INFO_CLASS, HEADER_TEXT,
} from './constants';
import logoImg from '../../assets/images/virus.svg';

export default function renderHeader(parentDiv) {
  const header = document.createElement('header');
  header.className = HEADER_CLASS;
  const wrapper = document.createElement('div');
  wrapper.className = HEADER_WRAPPER_CLASS;
  const logo = document.createElement('img');
  logo.className = HEADER_LOGO_CLASS;
  logo.src = logoImg;
  const info = document.createElement('div');
  info.className = HEADER_INFO_CLASS;
  info.innerText = HEADER_TEXT;
  wrapper.append(logo, info);
  header.append(wrapper);
  parentDiv.append(header);
}
