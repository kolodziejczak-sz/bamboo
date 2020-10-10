import leftpad from 'left-pad';
import greeting from './greeting';
import spacing from './spacing';

const loadData = async () => {
    let en = await import('./greeting');
    return en.default;
};

loadData().then((lazyGreeting) => {
    const message = [greeting, leftpad('', spacing), lazyGreeting].join('');
    console.log(message);
});
