import {
  GITHUB_LINKS, WRAPPER_CLASS, LOGO_CLASS, LOGO_LINK, INFO, YEAR,
} from './constants';

export default function renderFooter(parentDiv) {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  const wrapper = document.createElement('div');
  wrapper.className = WRAPPER_CLASS;
  const info = document.createElement('p');
  info.innerText = INFO;
  const year = document.createElement('p');
  year.innerText = YEAR;
  const logo = document.createElement('a');
  logo.className = LOGO_CLASS;
  logo.href = LOGO_LINK;
  const links = GITHUB_LINKS.map((link) => {
    const a = document.createElement('a');
    a.innerText = link.slice(link.lastIndexOf('/') + 1);
    a.href = link;
    return a;
  });
  wrapper.append(info, links[0], links[1], links[2], year, logo);
  footer.append(wrapper);
  parentDiv.append(footer);
}
