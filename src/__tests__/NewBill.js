import { screen, fireEvent } from "@testing-library/dom"
import '@testing-library/jest-dom/extend-expect';
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import firestore from "../app/Firestore.js"

// connected as an employee
Object.defineProperty(window, "localStorage", { value: localStorageMock });
window.localStorage.setItem(
    "user",
    JSON.stringify({
        type: "Employee",
    })
);

describe("Given I am connected as an employee", () => {

    describe("When I am on NewBill Page", () => {
        test("Then post should fail if required fields are not filled out", () => {
            const html = NewBillUI()
            document.body.innerHTML = html
            const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) }
            const formNewBill = screen.getByTestId('form-new-bill')
            const newbill = new NewBill({ document, onNavigate, firestore: null, localStorage: window.localStorage })
            const emptyBillMock = {}
            const handleSubmit = jest.fn(newbill.handleSubmit)
            const createBill = jest.fn(emptyBillMock)

            formNewBill.addEventListener('submit', handleSubmit)
            fireEvent.submit(formNewBill)

            expect(handleSubmit).toHaveBeenCalled();
            expect(createBill).not.toHaveBeenCalled();
        })
        test("It should call change file", () => {
            const html = NewBillUI()
            document.body.innerHTML = html
            const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) }
            const file = document.querySelector(`input[data-testid="file"]`)
            const newbill = new NewBill({ document, onNavigate, firestore: null, localStorage: window.localStorage })
            const handleChangeFile = jest.fn(newbill.handleChangeFile)
            file.addEventListener('change', handleChangeFile)
            const fileMock = 'abcdef890.png'
            fireEvent.change(file, { target: { files: [new File([fileMock], fileMock)] } }, { type: "image/png" })

            expect(handleChangeFile).toHaveBeenCalled();

        })

    })
})