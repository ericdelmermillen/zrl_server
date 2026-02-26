import { 
  BACKGROUND_COLOR, 
  BACKGROUND_LIGHT_COLOR, 
  BORDER_COLOR, 
  BORDER_RADIUS, 
  FONT, 
  FONT_SIZE_BODY, 
  FONT_SIZE_SMALL, 
  FONT_SIZE_TINY, 
  FONT_WEIGHT, 
  PRIMARY_COLOR, 
  SPACING_SMALL, 
  TEXT_COLOR,
  TEXT_LIGHT_COLOR, 
  TEXT_MUTED_COLOR 
} from "../styling/stylingConstants";

const FROM_EMAIL_ADDRESS = process.env.FROM_EMAIL_ADDRESS!;


const buildMoreInfoEmailTemplate = (name: string, bodyContent: string) => `
  <html>
    <body style="margin: 0; padding: 0; font-family: ${FONT}, sans-serif; background-color: ${BACKGROUND_COLOR};">

      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" style="padding: 20px 0;">

            <!-- OUTER CARD CONTAINER -->
            <table
              width="600"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="
                max-width: 768px;
                width: 100%;
                background-color: ${BACKGROUND_LIGHT_COLOR};
                border-radius: ${BORDER_RADIUS};
                overflow: hidden;
                border: 1px solid rgba(0,0,0,0.06);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
              "
            >

              <!-- HEADER -->
              <tr>
                <td style="padding: 48px ${SPACING_SMALL}; text-align: center; background-color: ${PRIMARY_COLOR};">
                  <h1 style="
                    margin: 0;
                    color: ${BACKGROUND_COLOR};
                    font-size: 28px;
                    font-weight: ${FONT_WEIGHT};
                    letter-spacing: 0.5px;
                  ">
                    Zidgy Road Labs
                  </h1>
                </td>
              </tr>

              <!-- BODY -->
              <tr>
                <td style="padding: 40px 24px;">

                  <!-- GREETING -->
                  <p style="
                    margin: 0 0 ${SPACING_SMALL} 0;
                    color: ${TEXT_COLOR};
                    font-size: ${FONT_SIZE_BODY};
                    line-height: 1.7;
                  ">Hi ${name.split(" ")[0]},</p>

                  ${bodyContent}

                  <!-- DIVIDER -->
                  <div style="height: 1px; background-color: ${BORDER_COLOR}; margin-bottom: 40px;"></div>

                  <!-- CTA -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center">
                        <a href="mailto:${FROM_EMAIL_ADDRESS}" style="
                          display: inline-block;
                          padding: 14px 32px;
                          background-color: ${PRIMARY_COLOR};
                          color: ${BACKGROUND_LIGHT_COLOR};
                          text-decoration: none;
                          border-radius: ${BORDER_RADIUS};
                          font-size: ${FONT_SIZE_BODY};
                          font-weight: ${FONT_WEIGHT};
                          font-family: ${FONT}, sans-serif;
                        ">Get in Touch</a>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="
                  padding: 24px 24px;
                  background-color: ${BACKGROUND_LIGHT_COLOR};
                  border-top: 1px solid ${BORDER_COLOR};
                  text-align: center;
                ">
                  <p style="
                    margin: 0 0 4px 0;
                    font-size: ${FONT_SIZE_SMALL};
                    color: ${TEXT_LIGHT_COLOR};
                  ">
                    Zidgy Road Labs
                  </p>
                  <p style="
                    margin: 0;
                    font-size: ${FONT_SIZE_TINY};
                    color: ${TEXT_MUTED_COLOR};
                  ">
                    © ${new Date().getFullYear()} All rights reserved
                  </p>
                </td>
              </tr>

            </table>
            <!-- END CARD CONTAINER -->

          </td>
        </tr>
      </table>

    </body>
  </html>
`;

export {
  buildMoreInfoEmailTemplate
};