import Enzyme, { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });



window.document.body.innerHTML = '<div id="root"></div>'

window.resizeTo = (width, height) => {
  window.innerWidth = width || window.innerWidth;
  window.innerHeight = width || window.innerHeight;
  window.dispatchEvent(new Event('resize'));
};
