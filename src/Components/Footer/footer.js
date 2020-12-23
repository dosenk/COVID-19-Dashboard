import {
  GITHUB_LINKS, WRAPPER_CLASS, LOGO_CLASS, LOGO_LINK, INFO, YEAR, LINKS_WRAPPER_CLASS, SPAN_POINT,
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
  const linksWrapper = document.createElement('div');
  linksWrapper.className = LINKS_WRAPPER_CLASS;
  GITHUB_LINKS.forEach((link, idx, arr) => {
    const a = document.createElement('a');
    a.innerText = link.slice(link.lastIndexOf('/') + 1);
    const span = document.createElement('span');
    span.innerHTML = `<span>${SPAN_POINT}</span>`;
    a.href = link;
    if (idx !== arr.length - 1) linksWrapper.append(a, span);
    else linksWrapper.append(a);
  });
  wrapper.append(info, linksWrapper, year, logo);
  footer.append(wrapper);
  parentDiv.append(footer);
}
