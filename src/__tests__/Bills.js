import { screen, fireEvent } from "@testing-library/dom"
import '@testing-library/jest-dom/extend-expect';
const $ = require('jquery');
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import Bill from "../containers/Bills"
import { bills } from "../fixtures/bills.js"
import { ROUTES } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"

describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
        test("Then bill icon in vertical layout should be highlighted", () => {
            const html = BillsUI({ data: [] })
            document.body.innerHTML = html
                //to-do write expect expression
        })

    })
    test("Then bills should be ordered from earliest to latest", () => {
        const html = BillsUI({ data: bills })
        document.body.innerHTML = html
        const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
        const antiChrono = (a, b) => ((a < b) ? 1 : -1)
        const datesSorted = [...dates].sort(antiChrono)
        expect(dates).toEqual(datesSorted)
    })
})
describe("Given I am connected as an employee and I am on bills page", () => {
    describe('When I click on \'nouvelle note de frais\' ', () => {
        test("Then I should be sent to newBill page", () => {
            // we have to mock navigation to test it
            const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) }

            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
            const firestore = null
            const bill = new Bill({
                document,
                onNavigate,
                firestore,
                localStorage: window.localStorage
            })

            const html = BillsUI({ data: bills })
            document.body.innerHTML = html
            const nouvNoteBtn = screen.getByTestId('btn-new-bill')

            // const html = NewBillUI()
            const handleClickNewBill = jest.fn(bill.handleClickNewBill)
            nouvNoteBtn.addEventListener('click', handleClickNewBill)

            userEvent.click(nouvNoteBtn)
            expect(handleClickNewBill).toHaveBeenCalled()
            expect(screen.getByText('Envoyer une note de frais')).toBeTruthy()
        })
    })
})