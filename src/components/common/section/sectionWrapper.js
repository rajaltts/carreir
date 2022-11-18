import '../../dashboard/Dashboard.scss';

export const sectionAddWrapper = (gridBgColor) => {
    document.querySelector('.section-wrapper').classList.add('dashboard-wrapper')
    document.querySelector('body').classList.add(gridBgColor) 
}

export const sectionRemoveWrapper = (gridBgColor) => {
    document.querySelector('.section-wrapper').classList.remove('dashboard-wrapper')
    document.querySelector('body').classList.remove(gridBgColor)
}