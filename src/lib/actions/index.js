export const selectOnFocus = node => {
    if (node && typeof node.select === 'function' ) {               // make sure node is defined and has a select() method
        const onFocus = event => node.select()                        // event handler
        node.addEventListener('focus', onFocus)                       // when node gets focus call onFocus()
        return {
            destroy: () => node.removeEventListener('focus', onFocus)   // this will be executed when the node is removed from the DOM
        }
    }
}

export const handle_keydown = event => {
    console.log('event', event)
    if (event.key === 'Escape') {
        close();
        return;
    }

    if (event.key === 'Tab') {
        // trap focus
        const nodes = node.querySelectorAll('*');
        const tabbable = Array.from(nodes).filter(n => n.tabIndex >= 0);

        let index = tabbable.indexOf(document.activeElement);
        if (index === -1 && e.shiftKey) index = 0;

        index += tabbable.length + (e.shiftKey ? -1 : 1);
        index %= tabbable.length;

        tabbable[index].focus();
        e.preventDefault();
    }
}
