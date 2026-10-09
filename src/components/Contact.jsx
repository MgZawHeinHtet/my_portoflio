import Reveal from './Reveal'

const fieldClass = 'mt-2 w-full rounded-xl border border-[#405044] bg-[#101815] px-4 py-3 text-[#f3f5f0] placeholder-[#819086] outline-none transition focus:border-[#c9f17c]'

export default function Contact() {
  return (
    <section className="border-t border-[#29342d] bg-[#101815]" id="contact">
      <div className="container-page section-pad">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <p className="eyebrow">04 / Get in touch</p>
              <h2 className="section-title">Let’s make something great<span className="text-[#c9f17c]">.</span></h2>
              <p className="muted mt-6 max-w-md leading-relaxed">Have a project in mind or just want to connect? Send me a message and let’s talk about it.</p>
              <a className="mt-9 inline-block break-all text-lg font-semibold text-[#c9f17c] underline decoration-[#c9f17c]/40 underline-offset-8 hover:decoration-[#c9f17c]" href="mailto:zawheinhtet1223@gmail.com">zawheinhtet1223@gmail.com ↗</a>
            </div>
            <form action="https://formsubmit.co/zawheinhtet1223@gmail.com" method="POST" className="surface p-6 sm:p-9">
              <h3 className="mb-7 text-2xl font-semibold text-white">Send a message</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-medium text-[#e3ebe2]">Your name<input type="text" name="name" autoComplete="name" required placeholder="Your name" className={fieldClass} /></label>
                <label className="text-sm font-medium text-[#e3ebe2]">Email address<input type="email" name="email" autoComplete="email" required placeholder="you@example.com" className={fieldClass} /></label>
              </div>
              <label className="mt-5 block text-sm font-medium text-[#e3ebe2]">Your message<textarea name="message" rows="5" required placeholder="Tell me about your idea..." className={fieldClass} /></label>
              <button type="submit" className="button-primary mt-6 w-full sm:w-auto">Send message <span aria-hidden="true">↗</span></button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
