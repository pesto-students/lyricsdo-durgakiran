import DOMPurify from 'dompurify';
import AppIcon from './Assets/AppIcon';
import Search from './Search/Search';

export default function Header() {
    return `<header class="header">
    <div class="header__logo">
        ${DOMPurify.sanitize(AppIcon())}
    </div>
    <div class="occ-space">
    </div>
    ${DOMPurify.sanitize(Search())}
    <div class="occ-space">
    </div>
</header>`;
}
