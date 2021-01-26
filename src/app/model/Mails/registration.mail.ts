export const RegistrationMail = {
    title: (uiUrl: string) => {
        return `${uiUrl} נא לאשר כתובת דואר אלקטרונית עבור אתר`
    },
    content: (name: string, link: string, mail: string, faqLink: string, uiUrl: string) => {
        return `
      <h1 style="direction: rtl;">
        <span style="font-weight: 400;">שלום ${name}!</span>
      </h1>
      
      <p style="direction: rtl;">
          <strong> נא ללחוץ על הקישור הבא על מנת </strong>
        <a href="${link}">
          <strong>לסיים תהליך אישור של כתובת דוא"ל</strong>
            <strong>${mail}</strong>
        </a>
      </p>
      
      <p style="direction: rtl;">&nbsp;</p>
      
      <p style="direction: rtl;">
        <strong>במידה ולחיצה על קישור לא פועלת, ניתן להעתיק קישור טקסט הבא ולהדביקו בשורת הכתובת של הדפדפן וללחוץ על </strong>
        <a href="${link}">
          <strong>${link}</strong>
        </a>
        <strong> &nbsp; כפתור "הכנס" במקלדת&nbsp;&nbsp;</strong>
      </p>
      
      <p style="direction: rtl;">&nbsp;</p>
      
      <p style="direction: rtl;">
        <strong>מכתב זה נשלח באופן אוטומטי. אם ברצונך לפנות אלינו, נא לפנות דרך </strong>
        <a href='${faqLink}'><strong>תמיכה</strong></a>
        <strong> ואנו נסייע לך.</strong>
      </p>`
    }
}